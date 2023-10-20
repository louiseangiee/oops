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
import java.util.Optional;

import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.Portfolio;
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

    // get all users
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findByUserId(Integer user_id) {
        return userRepository.findById(user_id);
    }

    public Page<User> findAllPaged(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Optional<User> findUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public void updateOTP(String email, String otp){
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User confirmedUser = user.get();
            confirmedUser.setOtp(otp);
            userRepository.save(confirmedUser);
        }
    }

    // POST and UPDATE
    public void save(User user) {
        userRepository.save(user);
    }

    // DELETE
    public void delete(User user) {
        userRepository.delete(user);
    }

    public void deleteById(int id) {
        userRepository.deleteById(id);
    }

    //TRYING OTP
    public String generateOtp(){
        SecureRandom secureRandom = new SecureRandom();
        int randInt = secureRandom.nextInt(900000) + 100000;
        return String.format("%06d", randInt);
    }

    public void sendSimpleMessage(String to, String subject, String body){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@g2t2.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
        System.out.println("Main sent successfully");
    }

    public void sendOtp(){

    }
}
