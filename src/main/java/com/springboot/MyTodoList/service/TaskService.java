package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    public List<Task> findAll(){
        List<Task> taskList = taskRepository.findAll();
        return taskList;
    }
    public ResponseEntity<Task> getTaskById(int id){
        Optional<Task> TaskData = taskRepository.findById(id);
        if (TaskData.isPresent()){
            return new ResponseEntity<>(TaskData.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public Task addTask(Task task){
        return taskRepository.save(task);
    }

    public boolean deleteTask(int id){
        try{
            taskRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }
    }
    public Task updateTask(int id, Task task){
        Optional<Task> taskData = taskRepository.findById(id);
        if(taskData.isPresent()){
            Task taskItem = taskData.get();
            BeanUtils.copyProperties(task, taskItem, "id");
            return taskRepository.save(taskItem);
            
        }else{
            return null;
        }
    }

    public List<Task> getTasksByUserProject(int assignedToID) {
        return taskRepository.findByAssignedToId(assignedToID);
    }
}
