package com.springboot.MyTodoList.telegram;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.Category;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.BotCommands.AgileCommands;
import com.springboot.MyTodoList.telegram.BotCommands.TaskCreationCommands;
import com.springboot.MyTodoList.telegram.BotCommands.TaskManagementCommands;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;
import com.springboot.MyTodoList.util.BotMessages;

public class CommandHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final MessageSender messageSender;
    private final ServiceManager database;
    private final KeyboardFactory keyboardFactory;

    //Commands
    private final TaskCreationCommands createTask;
    private final TaskManagementCommands manageTask;
    private final AgileCommands agile;

    public CommandHandler(MessageSender messageSender, ServiceManager serviceManager, 
                          InactivityManager inactivityManager) {
        this.messageSender = messageSender;
        this.database = serviceManager;
        //this.inactivityManager = inactivityManager;
        // Create a new CRUD controller using the ToDoItemService from ServiceManager
        this.keyboardFactory = new KeyboardFactory();
        this.createTask = new TaskCreationCommands(database, messageSender, inactivityManager);
        this.manageTask = new TaskManagementCommands(serviceManager, messageSender, inactivityManager);
        this.agile = new AgileCommands(serviceManager, messageSender, inactivityManager);
    }

    public void start(Long chatId, Update update){
        agile.handleStartCommand(chatId, update);
    }

    // Command check methods
    public boolean isStartCommand(String messageText) {
        return messageText.equals("/start");
    }

    public void handleCallback(long chatId, String callbackQuery, Update update, UserState state) {
        logger.debug("Got callback query !!! text: " + callbackQuery);
        String[] parts = callbackQuery.split("_");

        //Check callback info

        //Restart
        if (callbackQuery.equals("restart")) {
            agile.handleStartCommand(chatId, update);
        }
        //Developer get info on a task
        else if (callbackQuery.startsWith("taskinfo_")) {
            //Send task info
            manageTask.handleTaskInfoCallback(callbackQuery, chatId);
        }
        else if (callbackQuery.startsWith("taskManager_")){
            manageTask.handleManagerTaskOpen(callbackQuery, chatId);
        }
        //Change task state
        else if (callbackQuery.startsWith("set_task_state_")){
            manageTask.handleSetTaskStateCallback(callbackQuery, chatId, update, state);
        }
        else if (callbackQuery.startsWith("open_project")) {
            int userProjectId = Integer.parseInt(parts[3]);
            String userLevel = parts[2];

            agile.handleOpenProjectCallback(userProjectId, userLevel, chatId);
        }
        else if (callbackQuery.startsWith("create_task_project_")) {
            createTask.handleCreateTask(callbackQuery, chatId);
        }
        else if (callbackQuery.startsWith("set_statetask_category_")) {
            createTask.handleSetCategory(chatId, callbackQuery, state);
        }
        else if (callbackQuery.startsWith("set_statetask_type_")) {
            int type_id = Integer.parseInt(parts[3]);
            String type_label = parts[4];

            createTask.handleSetType(chatId, state, type_id, type_label);
        }
        else if (callbackQuery.startsWith("set_statetask_priority_")) {
            int priorityId = Integer.parseInt(parts[3]);
            String priorityLabel = parts[4];

            createTask.handleSetPriority(chatId, state, priorityId, priorityLabel);
            createTask.previewTask(chatId, state);
        }
        else if (callbackQuery.equals("save_task")) {
            //Save task
            createTask.handleSave(chatId, state);
        }
        else if (callbackQuery.equals("cancel_task_creation")) {
            //Cancel everything
            createTask.handleCancel(chatId, state);
            agile.handleStartCommand(chatId, update);
        }
        else if (callbackQuery.startsWith("open_actual_sprint")) {
            int projectId = Integer.parseInt(parts[3]);

            agile.showSprint(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_assign_task_")) {
            int task_id = Integer.parseInt(parts[3]);

            manageTask.handleAssignTask(chatId, task_id);
        }
        else if (callbackQuery.startsWith("assign_task_")){
            int task_id = Integer.parseInt(parts[2]);
            int userProjectId = Integer.parseInt(parts[4]);

            manageTask.assignTask(chatId, task_id, userProjectId, state);
        }
        else if (callbackQuery.startsWith("see_backlog_")) {
            int projectId = Integer.parseInt(parts[2]);

            agile.openBacklog(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_backlog_item_")) {
            int taskId = Integer.parseInt(parts[3]);

            agile.openBacklogItem(chatId, taskId);
        }
        else if (callbackQuery.startsWith("open_sprints_")) { //Available Sprints from a project
            int projectId = Integer.parseInt(parts[2]);

            agile.sprintList(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_sprint_")) {
            int sprintId = Integer.parseInt(parts[2]);

            agile.openSprint(chatId, sprintId);
        }
        else if (callbackQuery.startsWith("move_task_backlog_")) {
            int taskId = Integer.parseInt(parts[3]);

            manageTask.moveTaskToBacklog(chatId, taskId);
        }
        else if (callbackQuery.startsWith("add_next_sprint_")) {
            int taskId = Integer.parseInt(parts[3]);

            manageTask.SprintAssignUser(chatId, taskId, "Next");
        }
        else if (callbackQuery.startsWith("add_this_sprint_")) {
            int taskId = Integer.parseInt(parts[3]);

            manageTask.askConfirmation(chatId, taskId);
        }
        else if (callbackQuery.startsWith("confirm_this_sprint_")){
            int taskId = Integer.parseInt(parts[3]);

            //manageTask.addToThisSprint(chatId, taskId);
            manageTask.SprintAssignUser(chatId, taskId, "This");
        }
        else if (callbackQuery.startsWith("create_sprint_")){
            int projectID = Integer.parseInt(parts[2]);

            agile.askSprintStartDate(chatId, projectID, state);
        }
        else if (callbackQuery.startsWith("assignTaskNextSprint_")) {
            int taskId = Integer.parseInt(parts[1]);
            int userProjectId = Integer.parseInt(parts[3]);
            int projectId = Integer.parseInt(parts[5]);

            manageTask.addToSprintEstimatedHours(chatId, taskId, userProjectId, projectId, state, "Next");
        }
        else if (callbackQuery.startsWith("assignTaskThisSprint_")) {
            int taskId = Integer.parseInt(parts[1]);
            int userProjectId = Integer.parseInt(parts[3]);
            int projectId = Integer.parseInt(parts[5]);

            manageTask.addToSprintEstimatedHours(chatId, taskId, userProjectId, projectId, state, "This");
        }
    }    

    public void handleTextInput(UserState state, String messageText, Long chatId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        if (state.getState() == UserStateType.START) {
            message.setText(BotMessages.DEFAULT_MESSAGE_START.getMessage());
        } else if (state.getState() == UserStateType.STATE2) {
            message.setText(BotMessages.DEFAULT_MESSAGE_STATE2.getMessage());   

        } else if (state.getState() == UserStateType.CREATE_TASK_ENTER_NAME) {
            message.setText(BotMessages.CREATE_TASK_ENTER_DESCRIPTION.getMessage());
            createTask.handleSetTitle(state, messageText);
            
        } else if (state.getState() == UserStateType.CREATE_TASK_ENTER_DESCRIPTION) {
            message.setText(BotMessages.CREATE_TASK_SET_CATEGORY.getMessage());
            List<Category> categories = createTask.handleSetDescription(state, messageText);
            message.setReplyMarkup(keyboardFactory.inlineKeyboardCategorySet(categories));
        } else if (state.getState() == UserStateType.CREATE_TASK_ENTER_CATEGORY) {
            message.setText(messageText);
        } else if (state.getState() == UserStateType.ASSIGN_TASK_ENTER_ESTIMATED_HOURS) {
            Task taskToEdit = state.getAssignationTask();
            taskToEdit.setEstimatedHours(Integer.parseInt(messageText));

            Task result = database.task.updateTask(taskToEdit.getID(), taskToEdit);
            if (result != null) {
                message.setText(BotMessages.ESTIMATED_HOURS_ASSIGNED_SUCCESSFULLY.getMessage());
            }else{
                message.setText(BotMessages.ERROR_DATABASE.getMessage());
            }
        } else if (state.getState() == UserStateType.COMPLETE_TASK_ENTER_REAL_HOURS) {

            Task taskToAssignRealHours = state.getCompletionTask();
            taskToAssignRealHours.setRealHours(Integer.parseInt(messageText));

            Task result = database.task.updateTask(taskToAssignRealHours.getID(), taskToAssignRealHours);
            if (result != null) {
                message.setText(BotMessages.REAL_HOURS_ASSIGNED_SUCCESSFULLY.getMessage());
            } else {
                message.setText(BotMessages.ERROR_DATABASE.getMessage());
            }
        } else if (state.getState() == UserStateType.CREATE_SPRINT_ENTER_STARTDATE) {

            agile.setSprintStartDate(messageText, state, message);
            
        } else if (state.getState() == UserStateType.CREATE_SPRINT_ENTER_ENDDATE) {

            agile.setSprintEndDate(messageText, state, message);
        }
        //default
        else {
            message.setText(BotMessages.DEFAULT_MESSAGE_START.getMessage());
        }

        messageSender.sendMessage(message);
    }
}