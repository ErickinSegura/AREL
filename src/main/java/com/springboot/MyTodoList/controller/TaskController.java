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
    //@CrossOrigin
    @GetMapping(value = "/task")
    public List<Task> getAllToDoItems(){
        return taskService.findAll();
    }
    //@CrossOrigin
    @GetMapping(value = "/task/{id}")
    public ResponseEntity<Task> getToDoItemById(@PathVariable int id){
        try{
            ResponseEntity<Task> responseEntity = taskService.getTaskById(id);
            return new ResponseEntity<Task>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @SuppressWarnings("rawtypes")
    @PostMapping(value = "/task")
    public ResponseEntity addToDoItem(@RequestBody Task task) throws Exception{
        Task td = taskService.addTask(task);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location",""+td.getID());
        responseHeaders.set("Access-Control-Expose-Headers","location");
        //URI location = URI.create(""+td.getID())

        return ResponseEntity.ok()
                .headers(responseHeaders).build();
    }
    //@CrossOrigin
    @SuppressWarnings("rawtypes")
    @PutMapping(value = "/task/{id}")
    public ResponseEntity updateToDoItem(@RequestBody Task task, @PathVariable int id){
        try{
            Task task1 = taskService.updateTask(id, task);
            System.out.println(task1.toString());
            return new ResponseEntity<>(task1,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @DeleteMapping(value = "/task/{id}")
    public ResponseEntity<Boolean> deleteToDoItem(@PathVariable("id") int id){
        Boolean flag = false;
        try{
            flag = taskService.deleteTask(id);
            return new ResponseEntity<>(flag, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(flag,HttpStatus.NOT_FOUND);
        }
    }

}
