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
    
    public Sprint addSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    //Get Sprint by ID
    public Optional<Sprint> getSprintsbyID(int id){
        Optional<Sprint> sprintData = sprintRepository.findById(id);
        return sprintData;
    }

    public ResponseEntity<List<Sprint>> getAllSprints(int idProject) {
        List<Sprint> sprints = sprintRepository.getAllSprints(idProject);
        if (sprints.isEmpty() || sprints == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(sprints, HttpStatus.OK);
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

    public ResponseEntity<List<Sprint>> getSprintsByProjectID(Integer idProject) {
        List<Sprint> sprints = sprintRepository.getSprintsbyProjectID(idProject);
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

    public Integer getNewSprintNumber(Integer projectId) {
        Integer newSprint = sprintRepository.getNewSprintNumber(projectId);
        return newSprint;
    }

    public Integer getSprintNumberById(Integer sprintId) {
        Integer number = sprintRepository.findSprintNumberById(sprintId);
        return number;
    }

    public Sprint deleteSprint(int id) {
        Optional<Sprint> sprintData = sprintRepository.findById(id);
        if (sprintData.isPresent()) {
            Sprint sprint = sprintData.get();
            sprintRepository.delete(sprint);
            return sprint;
        } else {
            return null;
        }
    }

    public Sprint updateSprint(int id, Sprint sprint) {
        Optional<Sprint> sprintData = sprintRepository.findById(id);
        if (sprintData.isPresent()) {
            Sprint existingSprint = sprintData.get();
            existingSprint.setSprintNumber(sprint.getSprintNumber());
            existingSprint.setStartDate(sprint.getStartDate());
            existingSprint.setEndDate(sprint.getEndDate());
            return sprintRepository.save(existingSprint);
        } else {
            return null;
        }
    }
}
