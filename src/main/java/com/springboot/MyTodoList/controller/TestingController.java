package com.springboot.MyTodoList.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TestingController {
    @RequestMapping("test")
    public String test(){
        return "Test";
    }
}
