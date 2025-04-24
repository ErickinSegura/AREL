package com.springboot.MyTodoList.model;

import java.time.LocalDateTime;

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
    TaskState state;

    @Column(name = "CREATION_DATE", columnDefinition = "TIMESTAMP")
    LocalDateTime createdAt;

    @Column(name = "ESTIMATED_HOURS")
    Integer estimatedHours;

    @Column(name = "PROJECT_ID")
    Integer projectId;

    @ManyToOne
    @JoinColumn(name = "ASSIGNED_TO", referencedColumnName = "ID_USER_PROJECT")
    UserProject assignedTo;

    @ManyToOne
    @JoinColumn(name = "CATEGORY", referencedColumnName = "ID_CATEGORY")
    Category category;

    //@ManyToOne
    //@JoinColumn(name = "SPRINT_ID", referencedColumnName = "ID_SPRINT")
    @Column(name = "SPRINT_ID")
    Integer sprint;

    @Column(name = "DELETED")
    boolean deleted;

    @Column(name = "REAL_HOURS")
    Integer realHours;

    
    public Task(){
    }

    public Task(String title, String description, TaskType type, TaskPriority priority,
                TaskState state, LocalDateTime createdAt, Integer estimatedHours,
                Integer realHours, UserProject assignedTo, Category category, 
                Integer sprint, Integer projectId) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.priority = priority;
        this.state = state;
        this.createdAt = createdAt;
        this.estimatedHours = estimatedHours;
        this.realHours = realHours;
        this.assignedTo = assignedTo;
        this.category = category;
        this.sprint = sprint;
        this.deleted = false;
        this.projectId = projectId;
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

    public Integer getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Integer hours) {
        this.estimatedHours = hours;
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

    public Integer getSprintId() {
        return sprint;
    }

    public void setSprintId(Integer sprintId) {
        this.sprint = sprintId;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Integer getRealHours() {
        return realHours;
    }

    public void setRealHours(Integer hours) {
        this.realHours = hours;
    }

    public Integer getProjectId(){
        return projectId;
    }

    public void setProject(Integer newProjectId) {
        this.projectId = newProjectId;
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
        ", assignedTo: " + (assignedTo != null ? assignedTo.getRole() : "not assigned") +
        ", category: " + category.getName() +
        ", sprint: " + sprint +
        ", project: " + projectId + 
        ", deleted: " + deleted +
        ", estimatedHours: " + estimatedHours +
        ", realHours: " + realHours +
        "}";
    }

    public String getCoolFormatedString() {

        //Null checks

        return "<b>"+title+"</b>"
        +"\n\n"
        +type.formattedString()
        +" - "
        +description
        +"\n\n"
        +"<b>Category:</b> " + (category != null ? category.getName() : "No Category")
        +"\n"
        +"<b>Estimated Hours:</b> " + (estimatedHours != null ? estimatedHours : "Not set")
        +"\n"
        +"<b>State:</b> " + (state != null ? state.formatted() : "No State")
        ;
    }

    public String managerFormattedString() {

        //Null checks
        String stringRole = "Not set";
        if (assignedTo != null) {
            User assigned = assignedTo.getUser();
            stringRole = assignedTo.getRole() + " (" + assigned.getFirstName() + " " + assigned.getLastName() + ")";
        }

        return "<b>"+title+"</b>"
        +"\n\n"
        +type.formattedString()
        +" - "
        +description
        +"\n\n"
        +"<b>Category:</b> " + (category != null ? category.getName() : "No Category")
        +"\n"
        +"<b>Estimated Hours:</b> " + (estimatedHours != null ? estimatedHours : "Not set")
        +"\n"
        +"<b>Assigned to:</b> " + stringRole
        +"\n"
        +"<b>State:</b> " + (state != null ? state.formatted() : "No State")
        ;
    }

    public String previewString() {
        return "<b>"+title+"</b>"
        +"\n\n"
        +type.formattedString()
        +" - "
        +description
        +"\n\n"
        +"<b>Category:</b> " + (category != null ? category.getName() : "No Category")
        +"\n"
        +"<b>Priority:</b> " + priority.formattedString()
        ;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
