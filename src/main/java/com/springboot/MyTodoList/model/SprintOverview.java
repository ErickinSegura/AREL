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
}
