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

    @GetMapping("/overview/sprint-overviews")
    @ResponseBody
    public List<SprintOverview> getSprintOverviews() {
        return overviewService.getSprintOverviews();
    }

    @GetMapping("/overview/user-performances")
    @ResponseBody
    public List<UserPerformance> getUserPerformances() {
        return overviewService.getUserPerformances();
    }

    @GetMapping("/overview/overview-data")
    @ResponseBody
    public Map<String, Object> getOverviewData() {
        Map<String, Object> data = new HashMap<>();
        data.put("sprintOverviews", overviewService.getSprintOverviews());
        data.put("userPerformances", overviewService.getUserPerformances());
        return data;
    }

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

    @GetMapping("/overview/overview-data/{projectId}")
    @ResponseBody
    public Map<String, Object> getOverviewDataByProjectId(@PathVariable Long projectId) {
        Map<String, Object> data = new HashMap<>();
        data.put("sprintOverviews", overviewService.getSprintOverviewsByProjectId(projectId));
        data.put("userPerformances", overviewService.getUserPerformancesByProjectId(projectId));
        return data;
    }
}