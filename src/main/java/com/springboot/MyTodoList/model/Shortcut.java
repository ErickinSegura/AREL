package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the COLOR table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "SHORTCUT")
public class Shortcut {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_SHORTCUT")
    int ID;
    @ManyToOne
    @JoinColumn(name = "ID_PROJECT", referencedColumnName = "ID_PROJECT")
    Project project;

    @Column(name="SHORTCUT_URL")
    String url;
    
    public Shortcut(){

    }
    
    public Shortcut(Project project, String url){ 
        this.project = project;
        this.url = url;
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

    public String getURL() {
        return url;
    }

    public void setURL(String url) {
        this.url = url;
    }

    @Override
    public String toString() {
        return "Shortcut:{" +
                "id: " + ID +
                "url: " + url +
                ", project: " + project +
                "}";
    }
}
