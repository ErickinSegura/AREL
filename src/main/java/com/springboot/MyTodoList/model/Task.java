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
    TaskState state;

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
        return (state != null ? state.getId() : null);
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

    @JsonProperty("type")
    public void setTypeById(Integer typeId) {
        if (typeId == null) {
            this.type = null;
        } else {
            TaskType t = new TaskType();
            t.setID(typeId);
            this.type = t;
        }
    }

    @JsonProperty("priority")
    public void setPriorityById(Integer priorityId) {
        if (priorityId == null) {
            this.priority = null;
        } else {
            TaskPriority p = new TaskPriority();
            p.setID(priorityId);
            this.priority = p;
        }
    }

    @JsonProperty("state")
    public void setStateById(Integer stateId) {
        if (stateId == null) {
            this.state = null;
        } else {
            TaskState s = new TaskState();
            s.setId(stateId);
            this.state = s;
        }
    }

    @JsonProperty("category")
    public void setCategoryById(Integer categoryId) {
        if (categoryId == null) {
            this.category = null;
        } else {
            Category c = new Category();
            c.setID(categoryId);
            this.category = c;
        }
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
        try {
            if (title == null) {
                throw new NullPointerException("El título no puede ser nulo");
            }
            if (type == null) {
                throw new NullPointerException("El tipo no puede ser nulo");
            }
            if (description == null) {
                throw new NullPointerException("La descripción no puede ser nula");
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
                    +"<b>State:</b> " + (state != null ? state.formatted() : "No State")
                    ;
        } catch (NullPointerException e) {
            return "Error al formatear: " + e.getMessage();
        } catch (Exception e) {
            return "Error inesperado: " + e.getMessage();
        }
    }

    public String managerFormattedString() {
        try {
            if (title == null) {
                throw new NullPointerException("El título no puede ser nulo");
            }
            if (type == null) {
                throw new NullPointerException("El tipo no puede ser nulo");
            }
            if (description == null) {
                throw new NullPointerException("La descripción no puede ser nula");
            }

            String stringRole = "Not set";
            if (assignedTo != null) {
                try {
                    User assigned = assignedTo.getUser();
                    if (assigned == null) {
                        stringRole = assignedTo.getRole() + " (Usuario no disponible)";
                    } else {
                        String firstName = assigned.getFirstName() != null ? assigned.getFirstName() : "";
                        String lastName = assigned.getLastName() != null ? assigned.getLastName() : "";
                        stringRole = assignedTo.getRole() + " (" + firstName + " " + lastName + ")";
                    }
                } catch (Exception e) {
                    stringRole = "Error al obtener datos de usuario: " + e.getMessage();
                }
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
        } catch (NullPointerException e) {
            return "Error al formatear: " + e.getMessage();
        } catch (Exception e) {
            return "Error inesperado: " + e.getMessage();
        }
    }

    public String previewString() {
        try {
            if (title == null) {
                throw new NullPointerException("El título no puede ser nulo");
            }
            if (type == null) {
                throw new NullPointerException("El tipo no puede ser nulo");
            }
            if (description == null) {
                throw new NullPointerException("La descripción no puede ser nula");
            }
            if (priority == null) {
                throw new NullPointerException("La prioridad no puede ser nula");
            }

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
        } catch (NullPointerException e) {
            return "Error al formatear preview: " + e.getMessage();
        } catch (Exception e) {
            return "Error inesperado en preview: " + e.getMessage();
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
