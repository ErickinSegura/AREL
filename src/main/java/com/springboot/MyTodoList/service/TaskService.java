package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


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

    public Task updateTask(int id, Task taskUpdate) {
        Optional<Task> existingTaskOptional = taskRepository.findById(id);

        if (existingTaskOptional.isPresent()) {
            Task existingTask = existingTaskOptional.get();

            if (taskUpdate.getTitle() != null) {
                existingTask.setTitle(taskUpdate.getTitle());
            }

            if (taskUpdate.getDescription() != null) {
                existingTask.setDescription(taskUpdate.getDescription());
            }

            if (taskUpdate.getEstimatedHours() != null) {
                existingTask.setEstimatedHours(taskUpdate.getEstimatedHours());
            }

            if (taskUpdate.getRealHours() != null) {
                existingTask.setRealHours(taskUpdate.getRealHours());
            }

            if (taskUpdate.getSprint() != null) {
                existingTask.setSprint(taskUpdate.getSprint());
            }

            if (taskUpdate.getProjectId() != null) {
                existingTask.setProjectId(taskUpdate.getProjectId());
            }

            if (taskUpdate.isDeleted() != existingTask.isDeleted()) {
                existingTask.setDeleted(taskUpdate.isDeleted());
            }

            if (taskUpdate.getTypeId() != null) {
                existingTask.setTypeById(taskUpdate.getTypeId());
            }

            if (taskUpdate.getPriorityId() != null) {
                existingTask.setPriorityById(taskUpdate.getPriorityId());
            }

            if (taskUpdate.getStateId() != null) {
                existingTask.setStateById(taskUpdate.getStateId());
            }

            if (taskUpdate.getCategoryId() != null) {
                existingTask.setCategoryById(taskUpdate.getCategoryId());
            }

            if (taskUpdate.getAssignedToId() != null) {
                UserProject userProject = new UserProject();
                userProject.setID(taskUpdate.getAssignedToId());
                existingTask.setAssignedTo(userProject);
            } else if (taskUpdate.getAssignedTo() == null &&
                    existingTask.getAssignedTo() != null &&
                    taskUpdate.getAssignedTo() != existingTask.getAssignedTo()) {
                existingTask.setAssignedTo(null);
            }

            return taskRepository.save(existingTask);
        } else {
            return null;
        }
    }

    public List<Task> getTasksByProject(int projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTasksBySprintAndProject(int sprintId, int projectId) {
        return taskRepository.findBySprintAndProjectId(sprintId, projectId);
    }

    public Task assignUserSprintTask(int id, Task task) {
        Optional<Task> taskData = taskRepository.findById(id);
        if (taskData.isPresent()) {
            Task taskItem = taskData.get();

            taskItem.setAssignedTo(task.getAssignedTo());
            taskItem.setSprint(task.getSprint());

            return taskRepository.save(taskItem);
        }
        else {
            return null;
        }
    }

    public List<Task> getActiveTasksByUserProject(int assignedToID){
        return taskRepository.findActiveTasks(assignedToID);
    }

    public List<Task> getTasksByUserProject(int assignedToID) {
        return taskRepository.findByAssignedTo_Id(assignedToID);
    }

    public List<Task> getTasksBySprintID(int sprintID) {
        return taskRepository.findBySprint(sprintID);
    }

    public List<Task> getBacklog(int projectId) {
        return taskRepository.getBacklogTasks(projectId);
    }
}
