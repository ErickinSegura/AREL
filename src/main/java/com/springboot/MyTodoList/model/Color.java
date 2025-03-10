package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the COLOR table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "COLOR")
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_COLOR")
    int ID;
    @Column(name = "HEX_COLOR")
    String hexColor;
    
    public Color(){

    }
    
    public Color(String hexColor){ 
        this.hexColor = hexColor;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getHexColor() {
        return hexColor;
    }

    public void setHexColor(String hexColor) {
        this.hexColor = hexColor;
    }

    @Override
    public String toString() {
        return "Color:{" +
                "id: " + ID +
                "hexColor: " + hexColor
                +"}";
    }
}
