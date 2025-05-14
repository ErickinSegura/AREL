package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Logs;
import com.springboot.MyTodoList.repository.LogsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogsService {
    private final LogsRepository logsRepository;

    public LogsService(LogsRepository logsRepository) {
        this.logsRepository = logsRepository;
    }

    public ResponseEntity<List<Logs>> getLast10LogsByProjectID(int projectId) {
        return ResponseEntity.ok(logsRepository.findTop10ByProjectIdOrderByTimeOfLogDesc(projectId));
    }
}
