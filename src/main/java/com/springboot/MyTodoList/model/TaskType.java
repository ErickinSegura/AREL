package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the TASK_TYPE table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "TASK_TYPE")
public class TaskType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_TYPE")
    int ID;
    @Column(name = "TYPE_NAME")
    String label;
    
    public TaskType(){

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
        return "TaskType:{" +
                "id: " + ID +
                "label: " + label
                +"}";
    }
}
