package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.service.UserProjectService;
import com.springboot.MyTodoList.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserProjectService userProjectService;

    @GetMapping("/userlist/{projectId}/users")
    public ResponseEntity<List<User>> getUsersByProject(@PathVariable int projectId) {
        try {
            List<UserProject> userProjects = userProjectService.getUsersByProject(projectId);

            if (userProjects.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            List<User> users = userProjects.stream()
                    .map(UserProject::getUser)
                    .distinct()
                    .collect(Collectors.toList());

            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/userlist/by-level")
    public ResponseEntity<List<User>> getUsersByLevel(@RequestParam(required = false) List<Integer> levelIds){
        try {
            List<User> allUsers = userService.findAll();

            if (levelIds != null && !levelIds.isEmpty()) {
                List<User> filteredUsers = allUsers.stream()
                        .filter(user -> levelIds.contains(user.getUserLevel().getID()))
                        .collect(Collectors.toList());
                return new ResponseEntity<>(filteredUsers, HttpStatus.OK);
            }

            return new ResponseEntity<>(allUsers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/userlist/{id}")
    public ResponseEntity<User> getUserByID(@PathVariable int id){
        try{
            ResponseEntity<User> responseEntity = userService.getItemById(id);
            return new ResponseEntity<>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping(value = "userlist/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable int id){
        try{
            User us = userService.updateUser(id, user);
            return new ResponseEntity<>(us, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping(value = "userlist/{id}")
    public ResponseEntity<Boolean> deleteUser(@PathVariable("id") int id){
        Boolean flag = userService.deleteUser(id);
        return new ResponseEntity<>(flag, flag ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }
}