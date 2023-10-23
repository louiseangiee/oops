package com.oop.appa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.User;

@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    private JavaMailSender mailSender;

    // GET
    public List<User> findAll() {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all users service: ", e);
        }
    }

    public Optional<User> findByUserId(Integer user_id) {
        try {
            return userRepository.findById(user_id);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user by id service: ", e);
        }
    }

    public Page<User> findAllPaged(Pageable pageable) {
        try {
            return userRepository.findAll(pageable);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all users with pagination service: ", e);
        }
    }

    public Optional<User> findUserByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user by email service: ", e);
        }
    }

    public void updateOTP(String email, String otp) {
        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            user.setOtp(otp);
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error updating OTP service: ", e);
        }

    }

    // POST and UPDATE
    public void save(User user) {
        try {
            userRepository.save(user);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error saving user service: ", e);
        }
    }

    // DELETE
    public void delete(User user) {
        try {
            userRepository.delete(user);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user service: ", e);
        }
    }

    public void deleteById(int id) {
        try {
            userRepository.deleteById(id);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user by id service: ", e);
        }
    }

    // TRYING OTP
    public String generateOtp() {
        try {
            SecureRandom secureRandom = new SecureRandom();
            int randInt = secureRandom.nextInt(900000) + 100000;
            return String.format("%06d", randInt);
        } catch (Exception e) {
            throw new RuntimeException("Error generating OTP service: ", e);
        }

    }

    public void sendSimpleMessage(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@g2t2.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            System.out.println("Main sent successfully");
        } catch (Exception e) {
            throw new RuntimeException("Error sending email service: ", e);
        }
    }

    public String handleSendOTP(String email) {
        try {
            String otp = generateOtp();
            Optional<User> user = findUserByEmail(email);
            if (user.isPresent()) {
                updateOTP(email, otp);
                String body = String.format("This is your otp: %s", otp);
                sendSimpleMessage(email, "This is your OTP for OOP", body);
                return otp;
            }
            throw new RuntimeException("User not found");
        } catch (Exception e) {
            throw new RuntimeException("Error handling OTP service: ", e);
        }
    }

    public boolean verifyUserOtp(String email, String otp) {
        try {
            User user = findUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            return otp.equals(user.getOtp());
        } catch (Exception e) {
            throw new RuntimeException("Error verifying OTP service: ", e);
        }
    }

}
