package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.LogsDTO;
import com.springboot.MyTodoList.service.LogsService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class LogsController {
    private final LogsService logsService;

    public LogsController(LogsService logsService) {
        this.logsService = logsService;
    }

    @GetMapping("/logs/{projectId}")
    public ResponseEntity<List<LogsDTO>> getLogsByProject(@PathVariable int projectId) {
        return logsService.getLogsByProjectID(projectId);
    }
}
