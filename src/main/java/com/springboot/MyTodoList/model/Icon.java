package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the COLOR table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "ICON")
public class Icon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_ICON")
    int ID;
    @Column(name = "ICON_NAME")
    String iconName;
    
    public Icon(){

    }
    
    public Icon(String iconName){ 
        this.iconName = iconName;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    @Override
    public String toString() {
        return "Icon:{" +
                "id: " + ID +
                "iconName: " + iconName
                +"}";
    }
}
