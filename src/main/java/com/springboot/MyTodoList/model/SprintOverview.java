package com.springboot.MyTodoList.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SprintOverview {
    private String projectName;
    private Long projectId;
    private int sprintNumber;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int totalTasks;
    private int completedTasks;
    private int hoursSpentOnCompleted;
    private int totalEstimatedHours;
    private int totalRealHours;

    // Método para calcular el porcentaje de completitud de tareas
    public double getCompletionRate() {
        return totalTasks == 0 ? 0 : (completedTasks * 100.0) / totalTasks;
    }

    // Método para calcular la precisión del tiempo estimado
    public double getTimeAccuracy() {
        return totalEstimatedHours == 0 ? 0 : (totalRealHours * 100.0) / totalEstimatedHours;
    }
}