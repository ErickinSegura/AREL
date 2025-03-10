package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the USER_PROYECT table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "USER_PROJECT")
public class UserProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_USER_PROJECT")
    int ID;

    @ManyToOne
    @JoinColumn(name = "ID_USER", referencedColumnName = "ID_USER")
    User user;

    @ManyToOne
    @JoinColumn(name = "ID_PROJECT", referencedColumnName = "ID_PROJECT")
    Project project;

    @Column(name = "ROLE")
    String role;
    
    
    public UserProject(){
    }

    public UserProject(User user, Project project, String role) {
        this.user = user;
        this.project = project;
        this.role = role;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "userproyect:{" +
                "id: " + ID +
                "user: " + user +
                "project: " + project.getName() +
                "role: " + role
                +"}";
    }
}
