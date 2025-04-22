package com.springboot.MyTodoList.telegram.BotSessionManager;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;

public class UserState {
    private UserStateType state;

    //For Task Creation
    private Task activeTask;

    //For Task Assignation (Estimated hours)
    private Task assignationTask;

    //For Task completion (Real hours)
    private Task completionTask;

    //For Creating Sprints
    private Sprint sprintCreation;

    //For Reply Keyboard Buttons
    private Integer selectedProject;

    public UserState() {
        this.state = UserStateType.START;
        activeTask = new Task();
        assignationTask = new Task();
        completionTask = new Task();
        sprintCreation = new Sprint();
        selectedProject = null;
    }

    public UserState(UserStateType state){
        this.state = state;
        activeTask = new Task();
        assignationTask = new Task();
        completionTask = new Task();
        selectedProject = null;
    }

    public UserStateType getState() {
        return state;
    }

    public void setState(UserStateType newState) {
        this.state = newState;
    }

    public Task getTask() {
        return activeTask;
    }

    public void setTask(Task updatedTask) {
        this.activeTask = updatedTask;
    }

    public Task getAssignationTask() {
        return assignationTask;
    }

    public void setAssignationTask(Task updatedTask) {
        this.assignationTask = updatedTask;
    }

    public Task getCompletionTask() {
        return completionTask;
    }

    public void setCompletionTask(Task updatedTask) {
        this.completionTask = updatedTask;
    }

    public Sprint getSprintCreation() {
        return sprintCreation;
    }

    public void setSprintCreation(Sprint newSprint) {
        this.sprintCreation = newSprint;
    }

    public Integer getSelectedProject() {
        return selectedProject;
    }

    public void setSelectedProject(Integer newProjectID) {
        this.selectedProject = newProjectID;
    }
    
}
