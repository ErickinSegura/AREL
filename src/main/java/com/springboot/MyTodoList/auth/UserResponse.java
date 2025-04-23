package com.springboot.MyTodoList.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private int id;
    private String email;
    private String firstName;
    private String lastName;
    private String telegramUsername;
    private int userLevel;
    private Integer projectId;
    private String projectName;
    private String projectRole;
}