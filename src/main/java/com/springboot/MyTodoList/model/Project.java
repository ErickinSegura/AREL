package com.springboot.MyTodoList.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    Color color;
    @ManyToOne
    @JoinColumn(name="ID_ICON", referencedColumnName = "ID_ICON")
    Icon icon;

    //@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    //private List<Shortcut> shortcuts = new ArrayList<>();

    //@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    //private Set<UserProject> userProjects = new HashSet<>();
    
    public Project(){

    }
    
    public Project(String projectName, String description, Color color, Icon icon) {
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

    public Icon getIcon() {
        return icon;
    }

    public void setIcon(Icon icon) {
        this.icon = icon;
    }

    //public List<Shortcut> getShortcuts() {
    //    return shortcuts;
    //}

    //ublic void setShortcuts(List<Shortcut> shortcuts) {
    //    this.shortcuts = shortcuts;
    //}

    @Override
    public String toString() {
        return "Project:{" +
                "id: " + id +
                ", projectName: " + projectName +
                ", desription: " + description +
                ", color: " + color.getHexColor() +
                ", icon: " + icon.getIconName()
                +"}";
    }
}
