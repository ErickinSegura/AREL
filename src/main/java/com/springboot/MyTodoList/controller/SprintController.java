package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

@Controller
public class SprintController {
    @Autowired
    private SprintService sprintService;

    @GetMapping("/sprint/{id}")
    public ResponseEntity<List<Sprint>> getAllSprints(@PathVariable int id){
        List<Sprint> sprints = sprintService.getAllSprints(id).getBody();
        if(sprints == null){
            sprints = new ArrayList<>();
        }
        return new ResponseEntity<>(sprints, HttpStatus.OK);
    }

    @GetMapping("/sprint/{id}/active")
    public ResponseEntity<List<Sprint>> getAvailableSprints(@PathVariable int id){
        List<Sprint> sprints = sprintService.getAvailableSprints(id).getBody();
        if(sprints == null){
            sprints = new ArrayList<>();
        }
        return new ResponseEntity<>(sprints, HttpStatus.OK);
    }

    @PostMapping("/sprint")
    public ResponseEntity addSprint(@RequestBody Sprint sprint) throws Exception{
        Sprint sp = sprintService.addSprint(sprint);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + sp.getID());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    @DeleteMapping("/sprint/{id}")
    public ResponseEntity<Sprint> deleteSprint(@PathVariable int id) {
        Sprint sprint = sprintService.deleteSprint(id);
        if(sprint == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(sprint, HttpStatus.OK);
    }

    @PutMapping("/sprint/{id}")
    public ResponseEntity updateSprint(@PathVariable int id, @RequestBody Sprint sprint) throws Exception{
        Sprint sp = sprintService.updateSprint(id, sprint);
        if(sp == null){
            return new ResponseEntity<>(new Sprint(), HttpStatus.OK);
        }
        return new ResponseEntity<>(sp, HttpStatus.OK);
    }
}