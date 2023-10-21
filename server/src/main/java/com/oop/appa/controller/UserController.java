package com.oop.appa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        public ResponseEntity<String> sendEmail(@RequestParam String email){
            String otp = userService.generateOtp();
            Optional<User> user = userService.findUserByEmail(email);
//            String userEmail = "vitto.tedja2332@gmail.com";
            if(user.isPresent()) {
                userService.updateOTP(email, otp);
                String body = String.format("This is your otp: %s", otp);
                userService.sendSimpleMessage(
                        email,
                        "This is your OTP for OOP",
                        body
                );
                return ResponseEntity.ok(otp);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        @GetMapping("/verifyOTP")
        public boolean verifyOTP(@RequestParam String email, String otp){
            Optional<User> user = userService.findUserByEmail(email);
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
