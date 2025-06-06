package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the TASK_TYPE table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "TASK_PRIORITY")
public class TaskPriority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_PRIORITY")
    int ID;
    @Column(name = "PRIORITY_NAME")
    String label;
    
    public TaskPriority(){

    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    @Override
    public String toString() {
        return "TaskPriority:{" +
                "id: " + ID +
                "label: " + label
                +"}";
    }

    public String formattedString() {
        if (label == null || label.isEmpty()) return "";
        return label.substring(0, 1).toUpperCase() + label.substring(1);
    }
}
