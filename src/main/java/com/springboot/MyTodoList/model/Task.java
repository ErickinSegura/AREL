package com.springboot.MyTodoList.model;

import java.time.LocalDateTime;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TASK")
@Getter
@Setter
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TASK")
    private int ID;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "DESCRIPTION")
    private String description;

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
    private LocalDateTime createdAt;

    @Column(name = "ESTIMATED_HOURS")
    private Integer estimatedHours;

    @Column(name = "PROJECT_ID")
    private Integer projectId;

    @ManyToOne
    @JoinColumn(name = "ASSIGNED_TO", referencedColumnName = "ID_USER_PROJECT")
    private UserProject assignedTo;

    @ManyToOne
    @JoinColumn(name = "CATEGORY", referencedColumnName = "ID_CATEGORY")
    private Category category;

    @Column(name = "SPRINT_ID")
    private Integer sprint;

    @Column(name = "DELETED")
    private boolean deleted;

    @Column(name = "REAL_HOURS")
    private Integer realHours;
    
    @JsonIgnore
    public TaskType getType() {
        return this.type;
    }

    @JsonProperty("type")
    public Integer getTypeId() {
        return (type != null ? type.getID() : null);
    }

    @JsonIgnore
    public TaskPriority getPriority() {
        return this.priority;
    }

    @JsonProperty("priority")
    public Integer getPriorityId() {
        return (priority != null ? priority.getID() : null);
    }

    @JsonIgnore
    public TaskState getState() {
        return this.state;
    }

    @JsonProperty("state")
    public Integer getStateId() {
        return (state != null ? state.getID() : null);
    }

    @JsonIgnore
    public UserProject getAssignedTo() {
        return this.assignedTo;
    }

    @JsonProperty("assignedTo")
    public Integer getAssignedToId() {
        return (assignedTo != null ? assignedTo.getID() : null);
    }

    @JsonIgnore
    public Category getCategory() {
        return this.category;
    }

    @JsonProperty("category")
    public Integer getCategoryId() {
        return (category != null ? category.getID() : null);
    }


    @Override
    public String toString() {
        return "Task:{" +
                "id:" + ID +
                ", title:'" + title + "'" +
                ", description:'" + description + "'" +
                ", type:" + (type != null ? type.getLabel() : "null") +
                ", priority:" + (priority != null ? priority.getLabel() : "null") +
                ", state:" + (state != null ? state.getLabel() : "null") +
                ", createdAt:" + createdAt +
                ", assignedTo:" + (assignedTo != null ? assignedTo.getID() : "null") +
                ", category:" + (category != null ? category.getID() : "null") +
                ", sprint:" + sprint +
                ", projectId:" + projectId +
                ", deleted:" + deleted +
                ", estimatedHours:" + estimatedHours +
                ", realHours:" + realHours +
                '}';
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
