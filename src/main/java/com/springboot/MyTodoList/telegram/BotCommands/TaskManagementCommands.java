package com.springboot.MyTodoList.telegram.BotCommands;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.TaskState;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.KeyboardFactory;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;
import com.springboot.MyTodoList.util.BotMessages;

public class TaskManagementCommands {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final ServiceManager database;
    private final MessageSender messageSender;
    private final KeyboardFactory keyboardFactory;

    public TaskManagementCommands(ServiceManager database, MessageSender messageSender,
                                    InactivityManager inactivityManager) {
        this.database = database;
        this.messageSender = messageSender;
        this.keyboardFactory = new KeyboardFactory();
    }

    public void askConfirmation(Long chatId, int taskId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.ASK_CONFIRMATION_RUNNING_SPRINT.getMessage());
        message.setReplyMarkup(keyboardFactory.confirmAddThisSprint(taskId));
        messageSender.sendMessage(message);
    }

    public void SprintAssignUser(Long chatId, int taskId, String nextOrThis){
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        //Get User List
        ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);
        if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
            Task task = taskResponse.getBody();
            if (task != null) {
                int projectId = getProjectIdFromTask(task);
                
                List<UserProject> users = database.userProject.getUsersByProject(projectId);
                message.setText(BotMessages.ADDING_TO_NEXT_SPRINT_ASSIGN_USER.getMessage());
                message.setReplyMarkup(keyboardFactory.assignTaskSprint(users, taskId, projectId, nextOrThis));

            }else{
                message.setText(BotMessages.ERROR_DATABASE.getMessage());
            }
        }

        messageSender.sendMessage(message);
    }


    public void addToSprintEstimatedHours(Long chatId, int taskId, int userProjectId,
                                            int projectId, UserState state, String nextOrThis) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        Optional <UserProject> userProjectResponse = database.userProject.getUserProjectByID(userProjectId);

        Optional<Sprint> sprintResponse;
        if (nextOrThis.equals("This")){
            Integer thissprintId = database.project.getActiveSprint(projectId);
            sprintResponse = database.sprint.getSprintsbyID(thissprintId);
        }else { //next sprint
            sprintResponse = database.sprint.getNextSprint(projectId);
        }

        ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);
        if (sprintResponse.isPresent() && userProjectResponse.isPresent() && 
            taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {

            Task task = taskResponse.getBody();

            if (task != null) {            
                Sprint sprint = sprintResponse.get();
                UserProject userProject = userProjectResponse.get();

                task.setSprint(sprint.getID());
                task.setAssignedTo(userProject);

                //Task response = database.task.assignUserSprintTask(taskId, task);
                state.setAssignationTask(task);
                state.setState(UserStateType.ASSIGN_TASK_ENTER_ESTIMATED_HOURS);
                message.setText(BotMessages.ASSIGNED_SUCCESSFULLY.getMessage());
            }
        }

        messageSender.sendMessage(message);
    }

    public void moveTaskToBacklog(Long chatId, int taskId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.MOVING_TO_BACKLOG.getMessage());
        messageSender.sendMessage(message);

        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);
        if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()){
            Task task = taskResponse.getBody();

            if (task != null) {
                Integer projectID = getProjectIdFromTask(task);
                logger.debug("FOUND PROJECTID is " + projectID);
                task.setSprint(null);
                task.setProjectId(projectID);

                Task result = database.task.updateTask(taskId, task);

                if (result != null ) {
                    message.setText(BotMessages.SUCCESSFULLY_MOVED_TO_BACKLOG.getMessage());
                    message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerOpenProject(projectID));
                }
            }
        }

        messageSender.sendMessage(message);
    }

    public void assignTask(Long chatId, int taskId, int userProjectId, UserState state) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        Optional<UserProject> userProjectResponse = database.userProject.getUserProjectByID(userProjectId);
        ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);

        if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
            Task task = taskResponse.getBody();
            if (task != null) {
                if (userProjectResponse.isPresent()) {
                    task.setAssignedTo(userProjectResponse.get());

                    state.setAssignationTask(task);
                    message.setText(BotMessages.ASSIGNED_SUCCESSFULLY.getMessage());
                    state.setState(UserStateType.ASSIGN_TASK_ENTER_ESTIMATED_HOURS);
              
                }
            }else {
                message.setText(BotMessages.ERROR_DATABASE.getMessage());
            }
        }


        messageSender.sendMessage(message);
    }

    public void handleAssignTask(Long chatId, int task_id) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        //Get User List
        ResponseEntity<Task> taskResponse = database.task.getTaskById(task_id);
        if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
            Task task = taskResponse.getBody();
            if (task != null) {
                int projectId = getProjectIdFromTask(task);
                
                List<UserProject> users = database.userProject.getUsersByProject(projectId);
                message.setText(BotMessages.ASSIGN_USER_TO_TASK.getMessage());
                message.setReplyMarkup(keyboardFactory.assignTaskInlineMarkup(users, task_id));

            }else{
                message.setText(BotMessages.ERROR_DATABASE.getMessage());
            }
        }

        messageSender.sendMessage(message);
    }

    public void handleManagerTaskOpen(String callbackQuery, Long chatId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        
        try { 
            String taskIdString = callbackQuery.replace("taskManager_", "");
            int taskId = Integer.parseInt(taskIdString);

            ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);
            if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
                Task task = taskResponse.getBody();
                if (task != null) {
                    message.setText(task.managerFormattedString());
                    message.setReplyMarkup(keyboardFactory.taskInfoManagerKeyboard(task));
                } else {
                    message.setText(BotMessages.ERROR_DATABASE.getMessage());
                }
            } else {
                throw new RuntimeException("Error in server response: " + taskResponse.getStatusCode());
            }
        } catch (Exception e) {
            message.setText(BotMessages.TASK_UNAVAILABLE.getMessage() + "\n\n" + e.getLocalizedMessage());
        }

        messageSender.sendMessage(message);
    }

    //Send task info to developer
    public void handleTaskInfoCallback(String callbackQuery, long chatId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        
        try { 
            String taskIdString = callbackQuery.replace("taskinfo_", "");
            int taskId = Integer.parseInt(taskIdString);

            ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);
            if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
                Task task = taskResponse.getBody();
                if (task != null) {
                    message.setText(task.getCoolFormatedString());
                    message.setReplyMarkup(keyboardFactory.taskInfoInLineKeyboard(task));
                } else {
                    message.setText(BotMessages.ERROR_DATABASE.getMessage());
                }
            } else {
                throw new RuntimeException("Error in server response: " + taskResponse.getStatusCode());
            }
        } catch (Exception e) {
            message.setText(BotMessages.TASK_UNAVAILABLE.getMessage() + "\n\n" + e.getLocalizedMessage());
        }

        messageSender.sendMessage(message);
    }

    //Set State to a Task
    public void handleSetTaskStateCallback(String callbackQuery, long chatId, Update update, UserState state) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        try {
            String[] parts = callbackQuery.split("_");
    
            int taskId = Integer.parseInt(parts[3]);
            String taskState = parts[4];

            ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);

            if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
                TaskState newState = new TaskState();
                newState.setLabel(taskState);
                Task taskToEdit = taskResponse.getBody();
                
                if (taskToEdit != null) {
                    taskToEdit.setState(newState);
                    if (newState.formatted().equals("Done")) {
                        state.setCompletionTask(taskToEdit);
                        message.setText(BotMessages.CREATE_TASK_ENTER_ESTIMATEDHOURS.getMessage());
                        state.setState(UserStateType.COMPLETE_TASK_ENTER_REAL_HOURS);
                    }else {
                        Task result = database.task.updateTask(taskId, taskToEdit);
                        if (result != null) {
                            message.setText("Successfully changed task to state: " + newState.formatted());
                        } else {
                            message.setText(BotMessages.ERROR_DATABASE.getMessage());
                        }
                    }
                }
            }

        }catch (Exception e) {
            message.setText(e.getLocalizedMessage());
        }

        messageSender.sendMessage(message);
    }

    public void addToThisSprint(Long chatId, int taskId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        message.setText(BotMessages.ADDING_TO_CURRENT_SPRINT.getMessage());
        messageSender.sendMessage(message);

        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);
        if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
            Task task = taskResponse.getBody();
            if (task != null){
                int projectID = task.getProjectId();
                Integer sprintId = database.project.getActiveSprint(projectID);
                if (sprintId != null) {
                    task.setSprint(sprintId);
                    Task response = database.task.updateTask(taskId, task);
                    if (response != null) {
                        message.setText(BotMessages.SUCCESFFULLY_MOVED_TO_CURRENT_SPRINT.getMessage());
                        message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerOpenProject(projectID));
                    }
                }
            }
        }

        messageSender.sendMessage(message);
    }    

    public Integer getProjectIdFromTask(Task task) {
        if (task.getProjectId() != null) {
            return task.getProjectId();
        } else {
            return null;
            //Probably not necesary

            // Integer idResponse = database.sprint.getProjectbyId(task.getSprintId());
            // if (idResponse != null) {
            //     return idResponse;
            // }
            // else {
            //     return null;
            // }
        }
    }
}
