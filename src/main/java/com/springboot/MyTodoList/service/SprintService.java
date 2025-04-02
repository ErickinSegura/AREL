package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    public SprintService(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }
    
    //Get Sprint by ID
    public ResponseEntity<Sprint> getSprintsbyID(int id){
        Optional<Sprint> sprintData = sprintRepository.findById(id);
        if (sprintData.isPresent()){
            return new ResponseEntity<>(sprintData.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Integer> getActiveSprintId() {
        List<Integer> activeSprintIds = sprintRepository.findActiveSprintIds();
        
        if (activeSprintIds.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        return new ResponseEntity<>(activeSprintIds.get(0), HttpStatus.OK);
        //return ResponseEntity.ok(activeSprintIds.get(0));  // 200 OK
    }

    public ResponseEntity<Integer> getProjectbyId(Integer id) {
        List<Integer> projectIdList = sprintRepository.findProjectByID(id);

        if (projectIdList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        return new ResponseEntity<>(projectIdList.get(0), HttpStatus.OK);
    }

}
