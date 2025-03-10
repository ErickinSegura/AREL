package com.springboot.MyTodoList.model;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/*
    representation of the USER table that exists already
    in the autonomous database
 */
@Entity
@Table(name = "USER_TABLE")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_USER")
    int id;
    @Column(name = "FIRSTNAME")
    String firstName;
    @Column(name = "LASTNAME")
    String lastName;
    @Column(name = "EMAIL")
    String email;

    @ManyToOne
    @JoinColumn(name = "USER_LEVEL", referencedColumnName = "ID_USER_LEVEL")
    UserLevel userLevel;

    @Column(name = "TELEGRAMUSERNAME")
    String telegramUsername;
    @Column(name = "PASSWORD")
    String password;

    @Column(name = "LAST_SEEN", columnDefinition = "TIMESTAMP")
    LocalDateTime lastSeen;
    @Column(name = "CREATED", columnDefinition = "TIMESTAMP")
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserProject> userProjects = new HashSet<>();
    
    public User(){

    }
    public User(int ID, String firstName, String lastName, String email, UserLevel userLevel, String telegramUsername, String password, LocalDateTime lastSeen, LocalDateTime createdAt) {
        this.id = ID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userLevel = userLevel;
        this.telegramUsername = telegramUsername;
        this.password = password;
        this.lastSeen = lastSeen;
        this.createdAt = createdAt;
    }

    public int getID() {
        return id;
    }

    public void setID(int ID) {
        this.id = ID;
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

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setUserLevel(UserLevel userLevel) {
        this.userLevel = userLevel;
    }

    public UserLevel getUserLevel() {
        return userLevel;
    }

    public String getTelegramUsername() {
        return telegramUsername;
    }

    public void setTelegramUsername(String telegramUsername) {
        this.telegramUsername = telegramUsername;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public LocalDateTime getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(LocalDateTime newDate) {
        this.lastSeen = newDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime newDate) {
        this.createdAt = newDate;
    }

    @Override
    public String toString() {
        return "User{" +
                "ID=" + id +
                ", firstName=" + firstName +
                ", lastName=" + lastName +
                ", email=" + email +
                ", userLevel=" + userLevel.getLabel() +
                ", telegramUsername=" + telegramUsername +
                ", password=" + password +
                ", lastSeen=" + lastSeen +
                ", createdAt=" + createdAt +
                '}';
    }
}
