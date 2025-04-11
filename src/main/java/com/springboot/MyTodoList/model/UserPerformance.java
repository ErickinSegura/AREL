package com.springboot.MyTodoList.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPerformance {
    private String projectName;
    private Long projectId;
    private int sprintNumber;
    private String userName;
    private int assignedTasks;
    private int completedTasks;
    private double completionRate;
    private int totalEstimatedHours;
    private int totalRealHours;
    private double timeAccuracyPercentage;
}