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

    //@ManyToOne
    //@JoinColumn(name="ID_COLOR", referencedColumnName = "ID_COLOR")
    @Column(name="ID_COLOR")
    Integer color;

    //@ManyToOne
    //@JoinColumn(name="ID_ICON", referencedColumnName = "ID_ICON")
    @Column(name = "ID_ICON")
    Integer icon;

    @Column(name = "ACTIVE_SPRINT")
    Integer activeSprint;
    
    public Project(){

    }
    
    public Project(String projectName, String description, Integer color, Integer icon, Integer activeSprint) {
        this.projectName = projectName;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.activeSprint = activeSprint;
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

    public Integer getColor() {
        return color;
    }

    public void setColor(Integer color) {
        this.color = color;
    }

    public Integer getIcon() {
        return icon;
    }

    public void setIcon(Integer icon) {
        this.icon = icon;
    }

    public Integer getActiveSprintId() {
        return activeSprint;
    }

    public void setActiveSprint(int sprintId) {
        this.activeSprint = sprintId;
    }

    @Override
    public String toString() {
        return "Project:{" +
                "id: " + id +
                ", projectName: " + projectName +
                ", desription: " + description +
                ", color: " + color +
                ", icon: " + icon
                +"}";
    }
}
