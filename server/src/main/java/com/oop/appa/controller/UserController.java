package com.oop.appa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.oop.appa.service.UserService;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.User;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/users")
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

        @GetMapping("/paged")
        public Page<User> findAllPaged(Pageable pageable) {
            return userService.findAllPaged(pageable);
        }

        @GetMapping("/{user_id}")
        public Optional<User> findByUserId(@PathVariable Integer user_id) {
            return userService.findByUserId(user_id);
        }

        @GetMapping("/email/send")
        public void sendEmail(){
            String otp = userService.generateOtp();
            String body = String.format("This is your otp: %s", otp);
            userService.sendSimpleMessage(
                    "vitto.tedja2332@gmail.com",
                    "Testing 123",
                    body
            );
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
