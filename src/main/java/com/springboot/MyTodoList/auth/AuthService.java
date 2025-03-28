package com.springboot.MyTodoList.auth;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.UserRepository;
import com.springboot.MyTodoList.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

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

        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .telegramUsername(request.getTelegramUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
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
