package com.springboot.MyTodoList.model;

public class UserProjectDTO {
    private int userProjectId;
    private int userId;
    private String firstName;
    private String lastName;
    private String email;
    private String telegramUsername;
    private String avatar;
    private String role;
    private int projectId;
    private String projectName;

    // Constructor vacío
    public UserProjectDTO() {
    }

    // Constructor completo
    public UserProjectDTO(int userProjectId, int userId, String firstName, String lastName,
                          String email, String telegramUsername, String avatar, String role,
                          int projectId, String projectName) {
        this.userProjectId = userProjectId;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telegramUsername = telegramUsername;
        this.avatar = avatar;
        this.role = role;
        this.projectId = projectId;
        this.projectName = projectName;
    }

    // Getters y Setters
    public int getUserProjectId() {
        return userProjectId;
    }

    public void setUserProjectId(int userProjectId) {
        this.userProjectId = userProjectId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelegramUsername() {
        return telegramUsername;
    }

    public void setTelegramUsername(String telegramUsername) {
        this.telegramUsername = telegramUsername;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}