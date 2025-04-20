package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/task/{projectId}/tasks")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable int projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        if(tasks.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/task/{projectId}/sprints/{sprintId}/tasks")
    public ResponseEntity<List<Task>> getTasksBySprintAndProject(
            @PathVariable int projectId,
            @PathVariable int sprintId) {
        List<Task> tasks = taskService.getTasksBySprintAndProject(sprintId, projectId);
        if(tasks.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/task")
    public List<Task> getAllToDoItems(){
        return taskService.findAll();
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<Task> getToDoItemById(@PathVariable int id){
        try{
            ResponseEntity<Task> responseEntity = taskService.getTaskById(id);
            return new ResponseEntity<>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/task")
    public ResponseEntity addToDoItem(@RequestBody Task task) throws Exception{
        Task td = taskService.addTask(task);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location",""+td.getID());
        responseHeaders.set("Access-Control-Expose-Headers","location");
        return ResponseEntity.ok().headers(responseHeaders).build();
    }

    @PutMapping("/task/{id}")
    public ResponseEntity updateToDoItem(@RequestBody Task task, @PathVariable int id){
        try{
            Task task1 = taskService.updateTask(id, task);
            return new ResponseEntity<>(task1,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/task/{id}")
    public ResponseEntity<Boolean> deleteToDoItem(@PathVariable("id") int id){
        try{
            Boolean flag = taskService.deleteTask(id);
            return new ResponseEntity<>(flag, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(false,HttpStatus.NOT_FOUND);
        }
    }
}