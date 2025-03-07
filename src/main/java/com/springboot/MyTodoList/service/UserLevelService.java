package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.UserLevel;
import com.springboot.MyTodoList.repository.UserLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserLevelService {

    @Autowired
    private UserLevelRepository userLevelRepository;

    public List<UserLevel> getAllUserLevels() {
        return userLevelRepository.findAll();
    }

    public Optional<UserLevel> getUserLevelById(int id) {
        return userLevelRepository.findById(id);
    }

    public UserLevel addUserLevel(UserLevel userLevel) {
        return userLevelRepository.save(userLevel);
    }

    public void deleteUserLevel(int id) {
        userLevelRepository.deleteById(id);
    }
}
