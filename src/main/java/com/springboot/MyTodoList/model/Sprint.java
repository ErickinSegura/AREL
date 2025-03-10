package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the SPRINT table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "SPRINT")
public class Sprint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_SPRINT")
    int ID;

    @ManyToOne
    @JoinColumn(name = "ID_PROJECT", referencedColumnName = "ID_PROJECT")
    Project project;

    @Column(name = "SPRINT_NUMBER")
    int sprintNumber;
    
    public Sprint(){

    }
    
    public Sprint(Project project, int sprintNumber){ 
        this.project = project;
        this.sprintNumber = sprintNumber;
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

    @Override
    public String toString() {
        return "Sprint:{" +
                "id: " + ID +
                "project: " + project.getName() +
                "number: " + sprintNumber
                +"}";
    }
}
