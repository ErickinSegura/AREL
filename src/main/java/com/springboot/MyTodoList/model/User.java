package com.springboot.MyTodoList.model;

import javax.persistence.*;

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
    int ID_USER;
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
    
    public User(){

    }
    public User(int ID, String firstName, String lastName, String email, UserLevel userLevel, String telegramUsername, String password) {
        this.ID_USER = ID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userLevel = userLevel;
        this.telegramUsername = telegramUsername;
        this.password = password;
    }

    public int getID() {
        return ID_USER;
    }

    public void setID(int ID) {
        this.ID_USER = ID;
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

    @Override
    public String toString() {
        return "User{" +
                "ID=" + ID_USER +
                ", firstName=" + firstName +
                ", lastName=" + lastName +
                ", email=" + email +
                ", userLevel=" + userLevel +
                ", telegramUsername=" + telegramUsername +
                ", password=" + password +
                '}';
    }
}
