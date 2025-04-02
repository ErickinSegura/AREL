package com.springboot.MyTodoList.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {
    @GetMapping("/")
    public String root() {
        return "forward:/index.html";
    }

    @GetMapping("/{path:[^.]*}")
    public String singleLevel() {
        return "forward:/index.html";
    }
}