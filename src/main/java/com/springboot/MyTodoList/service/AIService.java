package com.springboot.MyTodoList.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AIService {
    @Value("${ai.service.url}")
    private String aiUrl;

    @Autowired
    private RestTemplate restTemplate;

    ObjectMapper objectMapper = new ObjectMapper();

    public ResponseEntity<String> helloWorld() {
        String response = restTemplate.getForObject(aiUrl, String.class);
        return ResponseEntity.ok("Respuesta desde Python: " + response);
    }

    public ResponseEntity<String> prompt(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of("prompt", prompt);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(aiUrl + "/prompt", entity, String.class);
            String stringResponse = response.getBody();
            JsonNode rootNode = objectMapper.readTree(stringResponse);
            String message = rootNode.get("message").asText(); // "message" field from python service

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    public ResponseEntity<String> transcript(String texto) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);

            HttpEntity<String> request = new HttpEntity<>(texto, headers);

            String response = restTemplate.postForObject(aiUrl + "/transcript", request, String.class);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Errrrrrrrror: " + e.getMessage());
        }
    }

}

