package com.oop.appa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.oop.appa.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import com.oop.appa.entity.User;
import com.oop.appa.exception.ErrorResponse;

import java.util.List;
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
    @Operation(summary = "Retrieve all users")
    public ResponseEntity<?> findAll() {
        try {
            List<User> users = userService.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all users");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/user")
    @Operation(summary = "Retrieve user by email or userid")
    @Parameter(name = "email", description = "email of user")
    @Parameter(name = "userid", description = "userid of user")
    public ResponseEntity<?> getUser(@RequestParam Optional<String> email, Optional<Integer> userid) {
        try {
            if (email.isPresent()) {
                Optional<User> user = userService.findUserByEmail(email.get());
                if (user.isPresent()) {
                    return ResponseEntity.ok(user.get());
                }
            } else if (userid.isPresent()) {
                Optional<User> user = userService.findByUserId(userid.get());
                if (user.isPresent()) {
                    return ResponseEntity.ok(user.get());
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request");

        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching user");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

    }

    @GetMapping("/paged")
    @Operation(summary = "Retrieve all users with pagination")
    @Parameter(name = "pageable", description = "pagination object")
    public ResponseEntity<?> findAllPaged(Pageable pageable) {
        try {
            Page<User> users = userService.findAllPaged(pageable);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all users with pagination");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/sendOTP")
    @Operation(summary = "Send OTP to user email")
    @Parameter(name = "email", description = "email of user")
    public ResponseEntity<?> sendEmail(@RequestParam String email) {
        try {
            String otp = userService.handleSendOTP(email);
            if (otp != null) {
                return ResponseEntity.ok(otp);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error sending OTP");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/verifyOTP")
    @Operation(summary = "Verify OTP")
    @Parameter(name = "email", description = "email of user")
    @Parameter(name = "otp", description = "otp of user")
    public ResponseEntity<?> verifyOTP(@RequestParam String email, String otp) {
        try {
            boolean isOtpValid = userService.verifyUserOtp(email, otp);
            if (isOtpValid) {
                return ResponseEntity.ok().body("OTP verified successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
            }
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error verifying OTP");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

    }

    // POST endpoint
    @PostMapping
    @Operation(summary = "Create a new user")
    @Parameter(name = "user", description = "user object")
    public ResponseEntity<?> save(User user) {
        try {
            userService.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error saving user");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping
    @Operation(summary = "Update a user")
    @Parameter(name = "user", description = "user object")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        try {
            userService.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error updating user");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{user_id}")
    @Operation(summary = "Delete a user by id")
    @Parameter(name = "user_id", description = "user id")
    public ResponseEntity<?> deleteById(@PathVariable int user_id) {
        try {
            userService.deleteById(user_id);
            return ResponseEntity.ok("User with ID " + user_id + " was successfully deleted.");
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting user with ID " + user_id);
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping
    @Operation(summary = "Delete a user by user object")
    @Parameter(name = "user", description = "user object")
    public ResponseEntity<?> delete(@RequestBody User user) {
        try {
            userService.delete(user);
            return ResponseEntity.ok("User was successfully deleted.");
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting user");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
