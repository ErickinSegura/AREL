package com.springboot.MyTodoList.telegram.BotSessionManager;

import com.springboot.MyTodoList.model.Task;

public class UserState {
    private UserStateType state;

    //For Task Creation
    private Task activeTask;

    public UserState() {
        this.state = UserStateType.START;
        activeTask = new Task();
    }

    public UserState(UserStateType state){
        this.state = state;
        activeTask = new Task();
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

    
}
