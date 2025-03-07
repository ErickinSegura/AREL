package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the USER_LEVEL table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "USER_LEVEL")
public class UserLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_USER_LEVEL")
    int ID;
    @Column(name = "USER_LEVEL_LABEL")
    String label;
    
    public UserLevel(){

    }
    
    public UserLevel(int id, String label){ 

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
        return "UserLevel:" +
                "id: " + ID +
                "label: " + label;
    }
}
