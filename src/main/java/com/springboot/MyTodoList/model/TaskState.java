package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the TASK_STATE table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "TASK_STATE")
public class TaskState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_STATE")
    int id;
    @Column(name = "STATE_NAME")
    String label;

    public int getId() {
        return id;
    }

    public void setId(int ID) {
        this.id = ID;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;

        if (label.equals("todo")){
            id = 1;
        }
        if (label.equals("doing")){
            id = 2;
        }
        if (label.equals("done")){
            id = 3;
        }
        if (label.equals("cancelled")){
            id = 4;
        }
    }

    public String formatted() {
        if (label.equals("todo")){
            return "To Do";
        }
        if (label.equals("doing")){
            return "Doing";
        }
        if (label.equals("done")){
            return "Done";
        }
        if (label.equals("cancelled")){
            return "Cancelled";
        }
        else return label;
    }

    @Override
    public String toString() {
        return "TaskState:{" +
                "id: " + id +
                "label: " + label
                +"}";
    }
}
