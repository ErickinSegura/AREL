package com.springboot.MyTodoList.model;

import java.time.LocalDateTime;

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
    Integer ID;

    //@ManyToOne
    //@JoinColumn(name = "ID_PROJECT", referencedColumnName = "ID_PROJECT")
    @Column(name = "ID_PROJECT")
    Integer project;

    @Column(name = "SPRINT_NUMBER")
    int sprintNumber;

    @Column(name = "START_DATE", columnDefinition = "TIMESTAMP")
    LocalDateTime startDate;

    @Column(name = "END_DATE", columnDefinition = "TIMESTAMP")
    LocalDateTime endDate;
    
    public Sprint(){

    }
    
    public Sprint(Integer projectId, int sprintNumber){ 
        this.project = projectId;
        this.sprintNumber = sprintNumber;
    }

    public Integer getID() {
        return ID;
    }

    public void setID(Integer ID) {
        this.ID = ID;
    }

    public int getSprintNumber() {
        return sprintNumber;
    }

    public void setSprintNumber(int sprintNumber) {
        this.sprintNumber = sprintNumber;
    }

    public Integer getProject() {
        return project;
    }

    public void setProject(Integer projectId) {
        this.project = projectId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime date) {
        this.startDate = date;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime date) {
        this.endDate = date;
    }

    @Override
    public String toString() {
        return "Sprint:{" +
                "id: " + ID +
                "project: " + project +
                "number: " + sprintNumber
                +"}";
    }
}
