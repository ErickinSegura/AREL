package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the USER table that exists already
    in the autonomous database
 */
@Entity
@Table(name = "USERTABLE")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int ID;
    @Column(name = "FIRSTNAME")
    String firstName;
    @Column(name = "LASTNAME")
    String lastName;
    @Column(name = "EMAIL")
    String email;
    @Column(name = "ROLE")
    String role;
    @Column(name = "TELEGRAMUSERNAME")
    String telegramUsername;
    @Column(name = "PASSWORD")
    String password;
    
    public User(){

    }
    public User(int ID, String firstName, String lastName, String email, String role, String telegramUsername, String password) {
        this.ID = ID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.telegramUsername = telegramUsername;
        this.password = password;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
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

    public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
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

    @Override
    public String toString() {
        return "User{" +
                "ID=" + ID +
                ", firstName=" + firstName +
                ", lastName=" + lastName +
                ", email=" + email +
                ", role=" + role +
                ", telegramUsername=" + telegramUsername +
                ", password=" + password +
                '}';
    }
}
