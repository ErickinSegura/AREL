package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Logs;
import com.springboot.MyTodoList.repository.LogsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class LogsService {
    @Autowired
    private final LogsRepository logsRepository;

    public LogsService(LogsRepository logsRepository) {
        this.logsRepository = logsRepository;
    }

    public ResponseEntity<Logs> getLast10LogsByProjectID(int projectId) {
        return ResponseEntity.ok(logsRepository.findTop10ByProjectIdOrderByTimeOfLogDesc(projectId));
    }


}
