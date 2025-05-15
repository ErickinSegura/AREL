package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.LogsDTO;
import com.springboot.MyTodoList.repository.LogsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogsService {
    private final LogsRepository logsRepository;

    public LogsService(LogsRepository logsRepository) {
        this.logsRepository = logsRepository;
    }

    public ResponseEntity<List<LogsDTO>> getLogsByProjectID(int projectId) {
        List<LogsDTO> logs = logsRepository.findTop10LogsByProjectId(projectId);
        return ResponseEntity.ok(logs);
    }
}