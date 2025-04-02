package com.springboot.MyTodoList.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    String firstName;
    String lastName;
    String email;
    String telegramUsername;
    String password;
    LocalDateTime createdAt;
}
