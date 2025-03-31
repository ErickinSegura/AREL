package com.springboot.MyTodoList.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private int id;
    private String email;
    private String firstName;
    private String lastName;
    private String telegramUsername;
}