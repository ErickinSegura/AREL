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
    int ID;
    @Column(name = "STATE_NAME")
    String label;

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

        if (label.equals("todo")){
            ID = 1;
        }
        if (label.equals("doing")){
            ID = 2;
        }
        if (label.equals("done")){
            ID = 3;
        }
        if (label.equals("cancelled")){
            ID = 4;
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
                "id: " + ID +
                "label: " + label
                +"}";
    }
}
