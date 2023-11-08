package com.oop.appa.service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import com.oop.appa.entity.User;

import jakarta.transaction.Transactional;

@Service
public interface UserService {

    public List<User> findAll();

    public Optional<User> findByUserId(Integer user_id);

    public Page<User> findAllPaged(Pageable pageable);

    public Optional<User> findUserByEmail(String email);
    
    @Transactional
    public void updateOTP(String email, String otp);
    
    // POST and UPDATE
    @Transactional
    public void save(User user);
    
    // DELETE
    @Transactional
    public void delete(User user);

    public void deleteById(int id);

    // TRYING OTP
    public String generateOtp();

    public void sendHtmlMessage(String to, String subject, String otp);

    public String handleSendOTP(String email);

    public boolean verifyUserOtp(String email, String otp);
    
    @Transactional
    public void deleteOtp(String email);

    @Transactional
    public void changePassword(String email, String password);
}
