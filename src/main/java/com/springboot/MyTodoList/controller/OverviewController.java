package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.SprintOverview;
import com.springboot.MyTodoList.model.UserPerformance;
import com.springboot.MyTodoList.service.OverviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class OverviewController {

    @Autowired
    private OverviewService overviewService;

    @GetMapping("/overview/sprint-overviews/{projectId}")
    @ResponseBody
    public List<SprintOverview> getSprintOverviewsByProjectId(@PathVariable Long projectId) {
        return overviewService.getSprintOverviewsByProjectId(projectId);
    }

    @GetMapping("/overview/user-performances/{projectId}")
    @ResponseBody
    public List<UserPerformance> getUserPerformancesByProjectId(@PathVariable Long projectId) {
        return overviewService.getUserPerformancesByProjectId(projectId);
    }

    @GetMapping("/overview/user-performance/{projectId}/{userId}")
    @ResponseBody
    public List<UserPerformance> getUserPerformanceByProjectIdAndUserId(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        return overviewService.getUserPerformanceByProjectIdAndUserId(projectId, userId);
    }

    @GetMapping("/overview/overview-data/{projectId}")
    @ResponseBody
    public Map<String, Object> getOverviewDataByProjectId(@PathVariable Long projectId) {
        Map<String, Object> data = new HashMap<>();
        data.put("sprintOverviews", overviewService.getSprintOverviewsByProjectId(projectId));
        data.put("userPerformances", overviewService.getUserPerformancesByProjectId(projectId));
        return data;
    }
}