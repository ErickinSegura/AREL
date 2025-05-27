package com.springboot.MyTodoList.model;

import javax.persistence.*;

/*
    representation of the CATEGORY table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "CATEGORY")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_CATEGORY")
    int ID;
    @Column(name = "CATEGORY_NAME")
    String name;

    //@ManyToOne
    //@JoinColumn(name = "ID_PROJECT", referencedColumnName = "ID_PROJECT")
    @Column(name = "ID_PROJECT")
    Integer projectId;

    
    public Category(){

    }

    public Category(String name, Integer project){
        this.name = name;
        this.projectId = project;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }


    @Override
    public String toString() {
        return "Category:{" +
                "id: " + ID +
                "name: " + name +
                "project: " + projectId + 
                "}";
    }
}
