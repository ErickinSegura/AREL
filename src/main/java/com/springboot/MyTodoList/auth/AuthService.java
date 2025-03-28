package com.springboot.MyTodoList.auth;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserLevel;
import com.springboot.MyTodoList.repository.UserLevelRepository;
import com.springboot.MyTodoList.repository.UserRepository;
import com.springboot.MyTodoList.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserLevelRepository userLevelRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        return null;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        if (userRepository.existsByTelegramUsername(request.getTelegramUsername())) {
            throw new IllegalArgumentException("Telegram username already in use");
        }

        UserLevel userLevel = userLevelRepository.findById(2).orElseThrow(() -> new RuntimeException("User level not found"));
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telegramUsername(request.getTelegramUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .createdAt(LocalDateTime.now())
                .userLevel(userLevel)
                .build();


        try {
            user = userRepository.save(user);

            return AuthResponse.builder()
                    .token(jwtService.getToken(user))
                    .build();

        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Registration failed due to data constraints");
        }


    }
}
