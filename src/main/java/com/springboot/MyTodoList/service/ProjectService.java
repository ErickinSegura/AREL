package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Color;
import com.springboot.MyTodoList.repository.ProjectRepository;
import com.springboot.MyTodoList.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ColorRepository colorRepository;

    public List<Project> findAll(){
        return projectRepository.findAll();
    }

    public ResponseEntity<Project> getItemById(int id){
        Optional<Project> projectData = projectRepository.findById(id);
        return projectData.map(project -> new ResponseEntity<>(project, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    public Project addProject(Project project){
        if (project.getColor() != null && project.getColor().getID() != 0) {
            Optional<Color> colorData = colorRepository.findById(project.getColor().getID());
            colorData.ifPresent(project::setColor);
        }
        return projectRepository.save(project);
    }

    public boolean deleteProject(int id){
        try{
            projectRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    public Project updateProject(int id, Project project){
        Optional<Project> projectData = projectRepository.findById(id);
        if(projectData.isPresent()){
            Project projectItem = projectData.get();
            projectItem.setID(id);
            projectItem.setName(project.getName());
            projectItem.setDescription(project.getDescription());

            if (project.getColor() != null && project.getColor().getID() != 0) {
                Optional<Color> colorData = colorRepository.findById(project.getColor().getID());
                if (colorData.isPresent()) {
                    projectItem.setColor(colorData.get());
                } else {
                    System.out.println("Color with ID " + project.getColor().getID() + " not found");
                }
            }

            projectItem.setIcon(project.getIcon());

            return projectRepository.save(projectItem);
        }else{
            return null;
        }
    }
}