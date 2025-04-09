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

    public ResponseEntity<Integer> getActiveSprintId(Integer projectId) {
        List<Integer> activeSprintIds = sprintRepository.findActiveSprintIds(projectId);
        
        if (activeSprintIds.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        return new ResponseEntity<>(activeSprintIds.get(0), HttpStatus.OK);
        //return ResponseEntity.ok(activeSprintIds.get(0));  // 200 OK
    }

    public Integer getProjectbyId(Integer id) {
        List<Integer> projectIdList = sprintRepository.findProjectByID(id);

        if (projectIdList.isEmpty()) {
            return null;
        }
        
        return projectIdList.get(0);
    }

    public ResponseEntity<List<Sprint>> getAvailableSprints(Integer idProject) {
        List<Sprint> sprints = sprintRepository.availableSprints(idProject);
        if(sprints.isEmpty() || sprints == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(sprints, HttpStatus.OK);
    }

    public Optional<Sprint> getNextSprint(Integer idProject) {
        List<Sprint> sprint_response = sprintRepository.getNextSprint(idProject);

        if (sprint_response.size() == 0 || sprint_response.isEmpty()) {
            return null;
        }
        else {
            return Optional.of(sprint_response.get(0));
        }
    }

}
