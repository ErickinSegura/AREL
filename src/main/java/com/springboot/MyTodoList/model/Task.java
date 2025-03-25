package com.springboot.MyTodoList.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.persistence.*;

/*
    representation of the TASK_TYPE table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "TASK")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_TASK")
    int ID;

    @Column(name = "TITLE")
    String title;

    @Column(name = "DESCRIPTION")
    String description;

    @ManyToOne
    @JoinColumn(name = "TASK_TYPE", referencedColumnName = "ID_TYPE")
    private TaskType type;

    @ManyToOne
    @JoinColumn(name = "TASK_PRIORITY", referencedColumnName = "ID_PRIORITY")
    private TaskPriority priority;

    @ManyToOne
    @JoinColumn(name = "TASK_STATE", referencedColumnName = "ID_STATE")
    private TaskState state;

    @Column(name = "CREATION_DATE", columnDefinition = "TIMESTAMP")
    LocalDateTime createdAt;

    @Column(name = "DUE_DATE", columnDefinition = "TIMESTAMP")
    LocalDateTime dueDate;

    @ManyToOne
    @JoinColumn(name = "ASSIGNED_TO", referencedColumnName = "ID_USER_PROJECT")
    UserProject assignedTo;

    @ManyToOne
    @JoinColumn(name = "CATEGORY", referencedColumnName = "ID_CATEGORY")
    Category category;

    @ManyToOne
    @JoinColumn(name = "SPRINT_ID", referencedColumnName = "ID_SPRINT")
    Sprint sprint;

    @Column(name = "DELETED")
    boolean deleted;

    @Column(name = "FINISHED_DATE", columnDefinition = "TIMESTAMP")
    LocalDateTime finishedDate;

    
    public Task(){
    }

    public Task(String title, String description, TaskType type, TaskPriority priority, TaskState state, 
                LocalDateTime createdAt, LocalDateTime dueDate, UserProject assignedTo, Category category, 
                Sprint sprint) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.priority = priority;
        this.state = state;
        this.createdAt = createdAt;
        this.dueDate = dueDate;
        this.assignedTo = assignedTo;
        this.category = category;
        this.sprint = sprint;
        this.deleted = false;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskType getType() {
        return type;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public TaskState getState() {
        return state;
    }

    public void setState(TaskState state) {
        this.state = state;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public UserProject getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(UserProject assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getFinishedDate() {
        return finishedDate;
    }

    public void setFinishedDate(LocalDateTime finishedDate) {
        this.finishedDate = finishedDate;
    }

    @Override
    public String toString() {
        return "Task:{" +
        "id: " + ID +
        ", title: " + title +
        ", description: " + description +
        ", type: " + type.getLabel() +
        ", priority: " + priority.getLabel() +
        ", state: " + state.getLabel() +
        ", createdAt: " + createdAt +
        ", dueDate: " + dueDate +
        ", assignedTo: " + assignedTo.getRole() +
        ", category: " + category.getName() +
        ", sprint: " + sprint.getSprintNumber() +
        ", deleted: " + deleted +
        ", finishedDate: " + finishedDate +
        "}";
    }

    public String getCoolFormatedString() {
        String dueDateString = "";
        if (!(dueDate == null)){
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM, dd");
            dueDateString = dueDate.format(formatter);
        } else {
            dueDateString = "Not Set";
        }

        return "<b>"+title+"</b>"
        +"\n\n"
        +type.getLabel().substring(0, 1).toUpperCase() + type.getLabel().substring(1)
        +" - "
        +description
        +"\n\n"
        +"<b>Category:</b> " + category.getName()
        +"\n"
        +"<b>Due Date:</b> " + dueDateString
        +"\n"
        +"<b>State:</b> " + state.formatted()
        ;
    }
}
