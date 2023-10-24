package com.oop.appa.auth;

import com.oop.appa.config.JwtService;
import com.oop.appa.dao.AccessLogRepository;
import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.AccessLog;
import com.oop.appa.entity.Role;
import com.oop.appa.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AccessLogRepository accessLogRepository;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        accessLogRepository.save(new AccessLog(user, "User creates account"));
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        accessLogRepository.save(new AccessLog(user, "User logs in"));
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}
