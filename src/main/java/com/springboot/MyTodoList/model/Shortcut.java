package com.springboot.MyTodoList.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/*
    representation of the COLOR table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "SHORTCUT")
public class Shortcut {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_SHORTCUT")
    private int id;

    @ManyToOne
    @JoinColumn(name = "ID_PROJECT", referencedColumnName = "ID_PROJECT")
    @JsonIgnore // Evita error 500 por serialización recursiva
    private Project project;

    @Column(name = "SHORTCUT_URL")
    private String url;

    public Shortcut() {}

    public Shortcut(Project project, String url) {
        this.project = project;
        this.url = url;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getURL() {
        return url;
    }

    public void setURL(String url) {
        this.url = url;
    }

    @JsonProperty("projectId")
    public int getProjectId() {
        return project != null ? project.getID() : 0;
    }

    @Override
    public String toString() {
        return "Shortcut:{" +
                "id: " + id +
                ", url: " + url +
                ", project: " + project +
                "}";
    }
}
