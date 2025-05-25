package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;
import lombok.Getter;
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

    @PatchMapping(value = "userlist/{id}/avatar")
    public ResponseEntity<User> updateUserAvatar(@PathVariable int id, @RequestBody AvatarRequest avatarRequest){
        try{
            User updatedUser = userService.updateUserAvatar(id, avatarRequest.getAvatar());
            if (updatedUser != null) {
                return new ResponseEntity<>(updatedUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "userlist/{id}")
    public ResponseEntity<Boolean> deleteUser(@PathVariable("id") int id){
        Boolean flag = userService.deleteUser(id);
        return new ResponseEntity<>(flag, flag ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }

    @Getter
    public static class AvatarRequest {
        private String avatar;
    }
}