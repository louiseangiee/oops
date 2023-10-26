package com.oop.appa.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;

import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.User;

import jakarta.mail.internet.MimeMessage;

@Service
public class UserService {
    private UserRepository userRepository;
    private JavaMailSender mailSender;
    private TemplateEngine templateEngine;

    private static ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    @Autowired
    public UserService(UserRepository userRepository, JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }


    // GET
    public List<User> findAll() {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all users service: " + e.getMessage(), e);
        }
    }

    public Optional<User> findByUserId(Integer user_id) {
        try {
            return userRepository.findById(user_id);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user by id service: " + e.getMessage(), e);
        }
    }

    public Page<User> findAllPaged(Pageable pageable) {
        try {
            return userRepository.findAll(pageable);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all users with pagination service: " + e.getMessage(), e);
        }
    }

    public Optional<User> findUserByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user by email service: " + e.getMessage(), e);
        }
    }

    public void updateOTP(String email, String otp) {
        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            user.setOtp(otp);
            userRepository.save(user);

            executor.schedule(() -> {
               deleteOtp(email);
            }, 5, TimeUnit.MINUTES);

        } catch (Exception e) {
            throw new RuntimeException("Error updating OTP service: " + e.getMessage(), e);
        }

    }

    // POST and UPDATE
    public void save(User user) {
        try {
            userRepository.save(user);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error saving user service: " + e.getMessage(), e);
        }
    }

    // DELETE
    public void delete(User user) {
        try {
            userRepository.delete(user);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user service: " + e.getMessage(), e);
        }
    }

    public void deleteById(int id) {
        try {
            userRepository.deleteById(id);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user by id service: " + e.getMessage(), e);
        }
    }

    // TRYING OTP
    public String generateOtp() {
        try {
            SecureRandom secureRandom = new SecureRandom();
            int randInt = secureRandom.nextInt(900000) + 100000;
            return String.format("%06d", randInt);
        } catch (Exception e) {
            throw new RuntimeException("Error generating OTP service: " + e.getMessage(), e);
        }

    }

    public void sendHtmlMessage(String to, String subject, String otp) {
        try {
            Context context = new Context();
            context.setVariable("otp", otp);
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom("goldmansachsoop@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            String htmlContent = templateEngine.process("otp-email.html", context);
            helper.setText(htmlContent, true);
        
            mailSender.send(mimeMessage);
            System.out.println("Mail sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error sending email service: ", e);
        }
    }

    public String handleSendOTP(String email) {
        try {
            String otp = generateOtp();
            Optional<User> user = findUserByEmail(email);
            if (user.isPresent()) {
                updateOTP(email, otp);
                sendHtmlMessage(email, "OTP for OOP", otp);
                return otp;
            }
            throw new RuntimeException("User not found");
        } catch (Exception e) {
            throw new RuntimeException("Error handling OTP service: " + e.getMessage(), e);
        }
    }

    public boolean verifyUserOtp(String email, String otp) {
        try {
            User user = findUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            return otp.equals(user.getOtp());
        } catch (Exception e) {
            throw new RuntimeException("Error verifying OTP service: " + e.getMessage(), e);
        }
    }

    public void deleteOtp(String email){
        try{
            User user = findUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            user.setOtp(null);
            save(user);
        }catch(Exception e){
            throw new RuntimeException("Error deleting OTP: " + e.getMessage());
        }
    }
}
