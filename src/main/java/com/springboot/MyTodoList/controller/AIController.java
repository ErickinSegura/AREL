package com.springboot.MyTodoList.controller;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.springboot.MyTodoList.service.AIService;

import org.springframework.http.ResponseEntity;


@RestController
public class AIController {
    @Autowired
    private AIService aiService;

    @GetMapping("/ai")
    public ResponseEntity<String> helloWorld(){
        return aiService.helloWorld();
    }

    @PostMapping("/send-prompt")
    public ResponseEntity<String> sendPrompt(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");

        return aiService.prompt(prompt);
    }
}
