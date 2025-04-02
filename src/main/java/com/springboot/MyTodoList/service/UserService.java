package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    public List<User> findAll(){
        List<User> users = userRepository.findAll();
        return users;
    }
    public ResponseEntity<User> getItemById(int id){
        Optional<User> userData = userRepository.findById(id);
        if (userData.isPresent()){
            return new ResponseEntity<>(userData.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public ResponseEntity<User> getUserByTelegramUsername(String telegramUsername){
        Optional<User> userData = userRepository.findByTelegramUsername(telegramUsername);
        if (userData.isPresent()){
            return new ResponseEntity<>(userData.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public User addUser(User user){
        return userRepository.save(user);
    }

    public boolean deleteUser(int id){
        try{
            userRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    public User findByEmail(String email) {
        Optional<User> userData = userRepository.findByEmail(email);
        return userData.orElse(null);
    }

    public User updateUser(int id, User newUser){
        Optional<User> userData = userRepository.findById(id);
        if(userData.isPresent()){
            User user = userData.get();
            user.setId(id);
            user.setFirstName(newUser.getFirstName());
            user.setLastName(newUser.getLastName());
            user.setEmail(newUser.getEmail());
            user.setUserLevel(newUser.getUserLevel());
            user.setTelegramUsername(newUser.getTelegramUsername());
            user.setPassword(newUser.getPassword());
            user.setCreatedAt(newUser.getCreatedAt());
            user.setLastSeen(newUser.getLastSeen());

            return userRepository.save(user);
        }else{
            return null;
        }
    }

}
