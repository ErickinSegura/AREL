package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.SprintOverview;
import com.springboot.MyTodoList.model.UserPerformance;
import com.springboot.MyTodoList.repository.OverviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OverviewService {

    @Autowired
    private OverviewRepository overviewRepository;

    public List<SprintOverview> getSprintOverviewsByProjectId(Long projectId) {
        return overviewRepository.getSprintOverviewsByProjectId(projectId);
    }

    public List<UserPerformance> getUserPerformanceByProjectIdAndUserId(Long projectId, Long userId) {
        return overviewRepository.getUserPerformanceByProjectIdAndUserId(projectId, userId);
    }

    public List<UserPerformance> getUserPerformancesByProjectId(Long projectId) {
        return overviewRepository.getUserPerformancesByProjectId(projectId);
    }
}