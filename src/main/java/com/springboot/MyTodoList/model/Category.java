package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the CATEGORY table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "CATEGORY")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_CATEGORY")
    int ID;
    @Column(name = "CATEGORY_NAME")
    String name;

    @ManyToOne
    @JoinColumn(name = "ID_PROJECT", referencedColumnName = "ID_PROJECT")
    Project project;

    @ManyToOne
    @JoinColumn(name = "ID_COLOR", referencedColumnName = "ID_COLOR")
    Color color;
    
    
    public Category(){

    }
    
    public Category(String name, Project project, Color color){ 
        this.name = name;
        this.project = project;
        this.color = color;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "Category:{" +
                "id: " + ID +
                "name: " + name +
                "project: " + project + 
                "color: " + color
                +"}";
    }
}
