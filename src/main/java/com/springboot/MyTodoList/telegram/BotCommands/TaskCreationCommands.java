package com.springboot.MyTodoList.telegram.BotCommands;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import com.springboot.MyTodoList.model.Category;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.TaskPriority;
import com.springboot.MyTodoList.model.TaskState;
import com.springboot.MyTodoList.model.TaskType;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.KeyboardFactory;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;
import com.springboot.MyTodoList.util.BotMessages;

public class TaskCreationCommands {
    private final ServiceManager database;
    private final MessageSender messageSender;
    private final KeyboardFactory keyboardFactory;
    private final InactivityManager inactivityManager;

    public TaskCreationCommands(ServiceManager database, MessageSender messageSender, InactivityManager inactivityManager) {
        this.database = database;
        this.messageSender = messageSender;
        this.keyboardFactory = new KeyboardFactory();
        this.inactivityManager = inactivityManager;
    }

    //Start task creation
    public void handleCreateTask(String callbackQuery, Long chatId) {
        UserState userState = inactivityManager.getUserState(chatId);
        int lastUnderscore = callbackQuery.lastIndexOf('_');
        String projectIDString = callbackQuery.substring(lastUnderscore + 1);
        Long projectId = Long.valueOf(projectIDString);
        
        Task actualTask = userState.getTask();
        actualTask.setProject(projectId);
        userState.setTask(actualTask);
        userState.setState(UserStateType.CREATE_TASK_ENTER_NAME);

        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.CREATE_TASK_ENTER_NAME.getMessage());
        
        messageSender.sendMessage(message);
    }

    //Setting title
    public void handleSetTitle(UserState state, String messageText) {
        //Save task title
        Task actualTask = state.getTask();
        actualTask.setTitle(messageText);
        state.setTask(actualTask);

        //Next, user will enter description
        state.setState(UserStateType.CREATE_TASK_ENTER_DESCRIPTION);
    }

    //Setting Description
    public List<Category> handleSetDescription(UserState state, String messageText) {
        List<Category> categoryList = new ArrayList<>();

        //Save task description
        Task actualTask = state.getTask();
        actualTask.setDescription(messageText);
        state.setTask(actualTask);

        //Get Categories
        Long projectId = state.getTask().getProjectId();
        ResponseEntity<List<Category>> categoryListResponse = database.category.getCategoriesByProject(projectId);
        if (categoryListResponse.getStatusCode().is2xxSuccessful() && categoryListResponse.hasBody()) {
            categoryList = categoryListResponse.getBody();
        }

        //Next, user will enter category
        state.setState(UserStateType.CREATE_TASK_ENTER_CATEGORY);

        return categoryList;
    }


    //Set Priority
    public void handleSetPriority(Long chatId, UserState state, int id, String label) {
        //CreateType
        TaskPriority newPriority = new TaskPriority();
        newPriority.setID(id);
        newPriority.setLabel(label);

        //Assign to Task
        Task actualTask = state.getTask();
        actualTask.setPriority(newPriority);
        state.setTask(actualTask);
    }

    //Set Type
    public void handleSetType(Long chatId, UserState state, int id, String label) {
        //Create Type
        TaskType newType = new TaskType();
        newType.setID(id);
        newType.setLabel(label);

        //Assign to Task
        Task actualTask = state.getTask();
        actualTask.setType(newType);
        state.setTask(actualTask);

        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.CREATE_TASK_SET_PRIORITY.getMessage());
        message.setReplyMarkup(keyboardFactory.inlineKeyboardPrioritySet());
        messageSender.sendMessage(message);
    }

    //Set Category
    public void handleSetCategory(Long chatId, String callbackQuery, UserState state) {
        SendMessage message = new SendMessage();
            message.setChatId(chatId);

            String[] parts = callbackQuery.split("_");
            int categoryId = Integer.parseInt(parts[3]);

            if (inactivityManager.isUserActive(chatId)) {
                ResponseEntity<Category> categoryResponse = database.category.getCategoryByID(categoryId);

                Task actualTask = state.getTask();

                if (categoryResponse.getStatusCode().is2xxSuccessful() && categoryResponse.hasBody()) {
                    Category category = categoryResponse.getBody();
                    
                    //Set task category
                    actualTask.setCategory(category);
                    state.setTask(actualTask);
                    message.setText(BotMessages.CREATE_TASK_SET_TYPE.getMessage());
                    message.setReplyMarkup(keyboardFactory.inlineKeyboardTypeSet());
                    state.setState(UserStateType.CREATE_TASK_ENTER_TYPE);

                } else {
                    message.setText(BotMessages.COULDNT_GET_CATEGORY.getMessage());
                }
            }else {
                //Invalid input
                message.setText(BotMessages.CREATE_TASK_INACTIVE.getMessage());
            }

            messageSender.sendMessage(message);
    }

    //Preview Task
    public void previewTask(Long chatId, UserState state) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        Task actualTask = state.getTask();
        message.setText(BotMessages.CREATE_TASK_PREVIEW.getMessage(actualTask.previewString()));
        message.setReplyMarkup(keyboardFactory.inlineKeyboardPreview());

        messageSender.sendMessage(message);
    }


    //Save Task (Task Creation)
    public void handleSave(Long chatId, UserState state) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        TaskState newState = new TaskState();
        newState.setID(1);
        newState.setLabel("todo");

        Task task = state.getTask();

        if (task != null) {
            task.setState(newState);
            database.task.addTask(task);
            message.setText(BotMessages.SAVE_TASK.getMessage());

            state.setTask(null);
        } else {
            message.setText(BotMessages.SENT_AGAIN_EXCEPTION.getMessage());
        }

        messageSender.sendMessage(message);
    }

    //Cancel task creation
    public void handleCancel(Long chatId, UserState state) {
        //Delete task
        state.setTask(null);

        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.CANCEL_TASK_CREATION.getMessage());
        messageSender.sendMessage(message);
    }
}
