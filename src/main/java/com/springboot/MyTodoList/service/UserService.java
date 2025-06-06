package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.UserRepository;
import com.springboot.MyTodoList.repository.UserProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProjectRepository userProjectRepository;

    public List<User> findAll(){
        List<User> users = userRepository.findAll();
        return users;
    }

    public List<User> findAvailableUsers(){
        List<User> allUsers = userRepository.findAll();

        // Obtener los IDs de usuarios que ya están asignados a proyectos
        List<Integer> assignedUserIds = userProjectRepository.findAll()
                .stream()
                .map(userProject -> userProject.getUser().getId())
                .distinct()
                .collect(Collectors.toList());

        // Filtrar usuarios según las reglas:
        // - Level 1: Siempre incluir
        // - Level 2: Solo si no están asignados
        // - Otros levels: Solo si no están asignados
        return allUsers.stream()
                .filter(user -> {
                    if (user.getUserLevel() != null && user.getUserLevel().getID() == 1) {
                        return true; // Siempre incluir usuarios level 1
                    } else {
                        return !assignedUserIds.contains(user.getId()); // Para level 2 y otros, solo si no están asignados
                    }
                })
                .collect(Collectors.toList());
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

    public User updateUserAvatar(int id, String avatar){
        Optional<User> userData = userRepository.findById(id);
        if(userData.isPresent()){
            User user = userData.get();
            user.setAvatar(avatar);
            return userRepository.save(user);
        }else{
            return null;
        }
    }
}