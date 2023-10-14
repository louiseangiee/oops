package com.oop.appa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.oop.appa.service.UserService;
import com.oop.appa.entity.User;

import java.util.List;

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

        @DeleteMapping("/{id}")
        public void deleteById(@PathVariable int id) {
            userService.deleteById(id);
        }

        @DeleteMapping
        public void delete(@RequestBody User user) {
            userService.delete(user);
        }
    }
