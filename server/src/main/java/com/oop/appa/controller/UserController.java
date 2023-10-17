package com.oop.appa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.oop.appa.service.UserService;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.User;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/users")
    public class UserController {
        private UserService userService;

        @Autowired
        public UserController(UserService userService) {
            this.userService = userService;
        }

        // GET endpoints
        @GetMapping()
        public List<User> findAll() {
            return userService.findAll();
        }

//        @GetMapping("/{email}")
//        public Optional<User> getUserByEmail(@PathVariable String email){
//            return userService.findUserByEmail(email);
//        }

        @GetMapping("/user")
        public Optional<User> getUser(@RequestParam Optional<String> email, Optional<Integer> userid){
            if(email.isPresent()){
                return userService.findUserByEmail(email.get());
            }
            if(userid.isPresent()) {
                return userService.findByUserId(userid.get());
            }
            return Optional.empty();
        }


        @GetMapping("/paged")
        public Page<User> findAllPaged(Pageable pageable) {
            return userService.findAllPaged(pageable);
        }

        @GetMapping("/sendOTP")
        public void sendEmail(@RequestParam int user_id){
            String otp = userService.generateOtp();
            Optional<User> user = userService.findByUserId(user_id);
            String userEmail = "vitto.tedja2332@gmail.com";
            if(user.isPresent()) {
                userEmail = user.get().getEmail();
            }
            userService.updateOTP(user_id, otp);
            String body = String.format("This is your otp: %s", otp);
            userService.sendSimpleMessage(
                    userEmail,
                    "This is your OTP for OOP",
                    body
            );
        }

        @GetMapping("/verifyOTP")
        public boolean verifyOTP(@RequestParam int user_id, String otp){
            Optional<User> user = userService.findByUserId(user_id);
            if(user.isPresent()){
                User confirmedUser = user.get();
                 return otp.equals(confirmedUser.getOtp());
            }
            return false;
        }

        // POST endpoint
        @PostMapping
        public void save(User user) {
            userService.save(user);
        }

        @PutMapping
        public void updateUser(@RequestBody User user) {
            userService.save(user);
        }

        @DeleteMapping("/{user_id}")
        public void deleteById(@PathVariable int user_id) {
            userService.deleteById(user_id);
        }

        @DeleteMapping
        public void delete(@RequestBody User user) {
            userService.delete(user);
        }
    }
