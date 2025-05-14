package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Logs;
import com.springboot.MyTodoList.service.LogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class LogsController {
    @Autowired
    private final LogsService logsService;
    public LogsController(LogsService logsService) {
        this.logsService = logsService;
    }


    // Method to get the last 10 logs by project ID
    @GetMapping("/logs/{projectId}")
    public ResponseEntity<Logs> getLast10LogsByProject(@PathVariable int projectId) {
        return logsService.getLast10LogsByProjectID(projectId);


}
