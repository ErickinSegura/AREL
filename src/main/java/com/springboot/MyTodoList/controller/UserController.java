package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.net.URI;
import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserService userService;
    //@CrossOrigin
    @GetMapping(value = "/userlist")
    public List<User> getAllUsers(){
        return userService.findAll();
    }
    //@CrossOrigin
    @GetMapping(value = "/userlist/{id}")
    public ResponseEntity<User> getUserByID(@PathVariable int id){
        try{
            ResponseEntity<User> responseEntity = userService.getItemById(id);
            return new ResponseEntity<User>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @PostMapping(value = "/userlist")
    public ResponseEntity addUser(@RequestBody User user) throws Exception{
        User us = userService.addUser(user);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location",""+us.getID());
        responseHeaders.set("Access-Control-Expose-Headers","location");
        //URI location = URI.create(""+td.getID())

        return ResponseEntity.ok()
                .headers(responseHeaders).build();
    }
    //@CrossOrigin
    @PutMapping(value = "userlist/{id}")
    public ResponseEntity updateUser(@RequestBody User user, @PathVariable int id){
        try{
            User us = userService.updateUser(id, user);
            System.out.println(us.toString());
            return new ResponseEntity<>(us,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @DeleteMapping(value = "userlist/{id}")
    public ResponseEntity<Boolean> deleteUser(@PathVariable("id") int id){
        Boolean flag = false;
        try{
            flag = userService.deleteUser(id);
            return new ResponseEntity<>(flag, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(flag,HttpStatus.NOT_FOUND);
        }
    }


}
