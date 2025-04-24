package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the PROJECT table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "PROJECT")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_PROJECT")
    int id;
    @Column(name = "PROJECT_NAME")
    String projectName;
    @Column(name = "DESCRIPTION")
    String description;

    @ManyToOne
    @JoinColumn(name="ID_COLOR", referencedColumnName = "ID_COLOR")
    //@Column(name="ID_COLOR")
    Color color;

    //@ManyToOne
    //@JoinColumn(name="ID_ICON", referencedColumnName = "ID_ICON")
    @Column(name = "ID_ICON")
    Integer icon;
    
    public Project(){

    }
    
    public Project(String projectName, String description, Color color, Integer icon) {
        this.projectName = projectName;
        this.description = description;
        this.icon = icon;
        this.color = color;
    }

    public int getID() {
        return id;
    }

    public void setID(int id) {
        this.id = id;
    }

    public String getName() {
        return projectName;
    }

    public void setName(String name) {
        this.projectName = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Integer getIcon() {
        return icon;
    }

    public void setIcon(Integer icon) {
        this.icon = icon;
    }

    @Override
    public String toString() {
        return "Project:{" +
                "id: " + id +
                ", projectName: " + projectName +
                ", desription: " + description +
                ", color: " + color.getHexColor() +
                ", icon: " + icon
                +"}";
    }
}
