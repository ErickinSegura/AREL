package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Logs;
import com.springboot.MyTodoList.service.LogsService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List<Logs>> getLast10LogsByProject(@PathVariable int projectId) {
        return logsService.getLast10LogsByProjectID(projectId);
    }
}
