package com.oop.appa.auth;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.oop.appa.exception.ErrorResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@CrossOrigin
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @Parameter(name = "request", description = "RegisterRequest object")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(service.register(request));
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error registering user");
            error.setDetails(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }

    }

    @PostMapping("/authenticate")
    @Operation(summary = "Authenticate a user")
    @Parameter(name = "request", description = "AuthenticationRequest object")
    public ResponseEntity<?> authenticate(
            @RequestBody AuthenticationRequest request) {
        try {
            return ResponseEntity.ok(service.authenticate(request));
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error authenticating user");
            error.setDetails(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }

    }

    @GetMapping("/forgotpassword")
    @Operation(summary = "Change Password if user verified")
    @Parameter(name = "email", description = "email of user")
    @Parameter(name = "password", description = "password of user")
    public ResponseEntity<?> changePassword(@RequestParam String email, String password) {
        HashMap<String, String> response = new HashMap<>();
        try {
            service.changePassword(email, password);
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error changing password");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
