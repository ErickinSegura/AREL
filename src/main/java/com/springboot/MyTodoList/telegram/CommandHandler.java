package com.springboot.MyTodoList.telegram;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.Category;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.BotCommands.AICommands;
import com.springboot.MyTodoList.telegram.BotCommands.AgileCommands;
import com.springboot.MyTodoList.telegram.BotCommands.KPICommands;
import com.springboot.MyTodoList.telegram.BotCommands.TaskCreationCommands;
import com.springboot.MyTodoList.telegram.BotCommands.TaskManagementCommands;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;
import com.springboot.MyTodoList.util.BotMessages;

public class CommandHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    // Agrega campos para los comandos
    private final TaskCreationCommands taskCreationCommands;
    private final AgileCommands agileCommands;
    private final TaskManagementCommands taskManagementCommands;
    private final KPICommands kpiCommands;
    private final AICommands aiCommands;
    private final InactivityManager inactivityManager;
    private final MessageSender messageSender;
    private final ServiceManager serviceManager;

    public CommandHandler(
        ServiceManager serviceManager,
        MessageSender messageSender,
        InactivityManager inactivityManager,
        TaskCreationCommands taskCreationCommands,
        AgileCommands agileCommands,
        TaskManagementCommands taskManagementCommands,
        KPICommands kpiCommands,
        AICommands aiCommands
    ) {
        this.serviceManager = serviceManager;
        this.messageSender = messageSender;
        this.inactivityManager = inactivityManager;
        this.taskCreationCommands = taskCreationCommands;
        this.agileCommands = agileCommands;
        this.taskManagementCommands = taskManagementCommands;
        this.kpiCommands = kpiCommands;
        this.aiCommands = aiCommands;
    }

    public void start(Long chatId, Update update){
        agileCommands.handleStartCommand(chatId, update);
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
            agileCommands.handleStartCommand(chatId, update);
        }
        //Developer get info on a task
        else if (callbackQuery.startsWith("taskinfo_")) {
            //Send task info
            taskManagementCommands.handleTaskInfoCallback(callbackQuery, chatId);
        }
        else if (callbackQuery.startsWith("taskManager_")){
            taskManagementCommands.handleManagerTaskOpen(callbackQuery, chatId);
        }
        //Change task state
        else if (callbackQuery.startsWith("set_task_state_")){
            taskManagementCommands.handleSetTaskStateCallback(callbackQuery, chatId, update, state);
        }
        else if (callbackQuery.startsWith("open_project")) {
            int userProjectId = Integer.parseInt(parts[3]);
            String userLevel = parts[2];

            agileCommands.handleOpenProjectCallback(userProjectId, userLevel, chatId, state);
        }
        else if (callbackQuery.startsWith("create_task_project_")) {
            taskCreationCommands.handleCreateTask(callbackQuery, chatId);
        }
        else if (callbackQuery.startsWith("set_statetask_category_")) {
            taskCreationCommands.handleSetCategory(chatId, callbackQuery, state);
        }
        else if (callbackQuery.startsWith("set_statetask_type_")) {
            int type_id = Integer.parseInt(parts[3]);
            String type_label = parts[4];

            taskCreationCommands.handleSetType(chatId, state, type_id, type_label);
        }
        else if (callbackQuery.startsWith("set_statetask_priority_")) {
            int priorityId = Integer.parseInt(parts[3]);
            String priorityLabel = parts[4];

            taskCreationCommands.handleSetPriority(chatId, state, priorityId, priorityLabel);
            taskCreationCommands.previewTask(chatId, state);
        }
        else if (callbackQuery.equals("save_task")) {
            //Save task
            taskCreationCommands.handleSave(chatId, state);
        }
        else if (callbackQuery.equals("cancel_task_creation")) {
            //Cancel everything
            taskCreationCommands.handleCancel(chatId, state);
            agileCommands.handleStartCommand(chatId, update);
        }
        else if (callbackQuery.startsWith("open_actual_sprint")) {
            int projectId = Integer.parseInt(parts[3]);

            agileCommands.showSprint(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_assign_task_")) {
            int task_id = Integer.parseInt(parts[3]);

            taskManagementCommands.handleAssignTask(chatId, task_id);
        }
        else if (callbackQuery.startsWith("assign_task_")){
            int task_id = Integer.parseInt(parts[2]);
            int userProjectId = Integer.parseInt(parts[4]);

            taskManagementCommands.assignTask(chatId, task_id, userProjectId, state);
        }
        else if (callbackQuery.startsWith("see_backlog_")) {
            int projectId = Integer.parseInt(parts[2]);

            agileCommands.openBacklog(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_backlog_item_")) {
            int taskId = Integer.parseInt(parts[3]);

            agileCommands.openBacklogItem(chatId, taskId);
        }
        else if (callbackQuery.startsWith("open_sprints_")) { //Available Sprints from a project
            int projectId = Integer.parseInt(parts[2]);

            agileCommands.sprintList(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_sprint_")) {
            int sprintId = Integer.parseInt(parts[2]);

            agileCommands.openSprint(chatId, sprintId);
        }
        else if (callbackQuery.startsWith("move_task_backlog_")) {
            int taskId = Integer.parseInt(parts[3]);

            taskManagementCommands.moveTaskToBacklog(chatId, taskId);
        }
        else if (callbackQuery.startsWith("add_next_sprint_")) {
            int taskId = Integer.parseInt(parts[3]);

            taskManagementCommands.SprintAssignUser(chatId, taskId, "Next");
        }
        else if (callbackQuery.startsWith("add_this_sprint_")) {
            int taskId = Integer.parseInt(parts[3]);

            taskManagementCommands.askConfirmation(chatId, taskId);
        }
        else if (callbackQuery.startsWith("confirm_this_sprint_")){
            int taskId = Integer.parseInt(parts[3]);

            taskManagementCommands.SprintAssignUser(chatId, taskId, "This");
        }
        else if (callbackQuery.startsWith("create_sprint_")){
            int projectID = Integer.parseInt(parts[2]);

            agileCommands.askSprintStartDate(chatId, projectID, state);
        }
        else if (callbackQuery.startsWith("assignTaskNextSprint_")) {
            int taskId = Integer.parseInt(parts[1]);
            int userProjectId = Integer.parseInt(parts[3]);
            int projectId = Integer.parseInt(parts[5]);

            taskManagementCommands.addToSprintEstimatedHours(chatId, taskId, userProjectId, projectId, state, "Next");
        }
        else if (callbackQuery.startsWith("assignTaskThisSprint_")) {
            int taskId = Integer.parseInt(parts[1]);
            int userProjectId = Integer.parseInt(parts[3]);
            int projectId = Integer.parseInt(parts[5]);

            taskManagementCommands.addToSprintEstimatedHours(chatId, taskId, userProjectId, projectId, state, "This");
        }
        else if (callbackQuery.startsWith("kpi_sprints_project_")){
            int projectId = Integer.parseInt(parts[3]);

            kpiCommands.KPIMenuSprints(chatId, projectId);
        }
        else if (callbackQuery.startsWith("kpi_users_project_")) {
            int projectId = Integer.parseInt(parts[3]);

            kpiCommands.KPIMenuUsers(chatId, projectId);
        }
        else if (callbackQuery.startsWith("kpi_sprint_")) {
            int sprintId = Integer.parseInt(parts[2]);
            int projectID = Integer.parseInt(parts[3]);

            kpiCommands.openKPISprint(chatId, projectID, sprintId);
        }
        else if (callbackQuery.startsWith("kpi_user_")) {
            int userProjectId = Integer.parseInt(parts[2]);
            int projectID = Integer.parseInt(parts[3]);

            kpiCommands.openKPIUser(chatId, userProjectId, projectID);
        }
        else if (callbackQuery.startsWith("kpi_sprintUser_")){
            int sprintNumber = Integer.parseInt(parts[2]);
            int userProjectID = Integer.parseInt(parts[3]);
            int projectID = Integer.parseInt(parts[4]);
            
            kpiCommands.openKPIUserSprint(chatId, sprintNumber, userProjectID, projectID);
        }
        else if (callbackQuery.startsWith("kpi_")) {
            int projectId = Integer.parseInt(parts[1]);

            kpiCommands.openKPIMenu(chatId, projectId);
        }
        else if (callbackQuery.startsWith("see_tasks_developers_")) {
            int projectId = Integer.parseInt(parts[3]);

            taskManagementCommands.selectUserForTaskMonitoring(chatId, projectId);
        }
        else if (callbackQuery.startsWith("get_tasks_user_")) {
            int userProjectId = Integer.parseInt(parts[3]);

            taskManagementCommands.openTaskListUser(chatId, userProjectId);
        }
    }    

    public void handleTextInput(UserState state, String messageText, Long chatId, Update update) {
        if (messageText.startsWith("/ai ")){
            aiCommands.sendPrompt(chatId, messageText);
            return;
        }
        //Reply Keyboard Buttons
        if (messageText.equals("Open this Sprint")) {
            Integer projectId = checkForActiveProject(state, chatId, update);
            if (projectId != null) {
                agileCommands.showSprint(chatId, projectId);
            }
            return;

        } else if (messageText.equals("Create Task")) {
            Integer projectId = checkForActiveProject(state, chatId, update);
            if (projectId != null) {
                String call = "create_task_project_"+ projectId;
                taskCreationCommands.handleCreateTask(call, chatId);
            }
            return;

        } else if (messageText.equals("See Backlog")) {
            Integer projectId = checkForActiveProject(state, chatId, update);
            if (projectId != null) {
                agileCommands.openBacklog(chatId, projectId);
            }
            return;

        } else if (messageText.equals("Sprints")) {
            Integer projectId = checkForActiveProject(state, chatId, update);
            if (projectId != null) {
                agileCommands.sprintList(chatId, projectId);
            }
            return;

        } else if (messageText.equals("KPI Overview")) {
            Integer projectId = checkForActiveProject(state, chatId, update);
            if (projectId != null) {
                kpiCommands.openKPIMenu(chatId, projectId);
            }
            return;
        } else if (messageText.equals("See developers' tasks")) {
            Integer projectId = checkForActiveProject(state, chatId, update);
            if (projectId != null) {
                taskManagementCommands.selectUserForTaskMonitoring(chatId, projectId);
            }
            return;
        }
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        //State Checks
        if (state.getState() == UserStateType.START) {
            message.setText(BotMessages.DEFAULT_MESSAGE_START.getMessage());
        } else if (state.getState() == UserStateType.STATE2) {
            message.setText(BotMessages.DEFAULT_MESSAGE_STATE2.getMessage());

        } else if (state.getState() == UserStateType.CREATE_TASK_ENTER_NAME) {
            message.setText(BotMessages.CREATE_TASK_ENTER_DESCRIPTION.getMessage());
            taskCreationCommands.handleSetTitle(state, messageText);

        } else if (state.getState() == UserStateType.CREATE_TASK_ENTER_DESCRIPTION) {
            message.setText(BotMessages.CREATE_TASK_SET_CATEGORY.getMessage());
            List<Category> categories = taskCreationCommands.handleSetDescription(state, messageText);
            message.setReplyMarkup(new KeyboardFactory().inlineKeyboardCategorySet(categories));
        } else if (state.getState() == UserStateType.CREATE_TASK_ENTER_CATEGORY) {
            message.setText(messageText);
        } else if (state.getState() == UserStateType.ASSIGN_TASK_ENTER_ESTIMATED_HOURS) {
            Task taskToEdit = state.getAssignationTask();
            taskToEdit.setEstimatedHours(Integer.parseInt(messageText));

            Task result = serviceManager.task.updateTask(taskToEdit.getID(), taskToEdit);
            if (result != null) {
                message.setText(BotMessages.ESTIMATED_HOURS_ASSIGNED_SUCCESSFULLY.getMessage());
            }else{
                message.setText(BotMessages.ERROR_DATABASE.getMessage());
            }
        } else if (state.getState() == UserStateType.COMPLETE_TASK_ENTER_REAL_HOURS) {
            Task taskToAssignRealHours = state.getCompletionTask();
            taskToAssignRealHours.setRealHours(Integer.parseInt(messageText));

            Task result = serviceManager.task.updateTask(taskToAssignRealHours.getID(), taskToAssignRealHours);
            if (result != null) {
                message.setText(BotMessages.REAL_HOURS_ASSIGNED_SUCCESSFULLY.getMessage());
            } else {
                message.setText(BotMessages.ERROR_DATABASE.getMessage());
            }
        } else if (state.getState() == UserStateType.CREATE_SPRINT_ENTER_STARTDATE) {

            agileCommands.setSprintStartDate(messageText, state, message);
            
        } else if (state.getState() == UserStateType.CREATE_SPRINT_ENTER_ENDDATE) {

            agileCommands.setSprintEndDate(messageText, state, message);
        }
        //default
        else {
            message.setText(BotMessages.DEFAULT_MESSAGE_START.getMessage());
        }

        messageSender.sendMessage(message);
    }

    public Integer checkForActiveProject(UserState state, Long chatId, Update update) {
        Integer actualProject = state.getSelectedProject();
        if (actualProject != null) {
            return state.getSelectedProject();

        }else {
            logger.debug("No active project");
            agileCommands.noProjectSelectedManager(chatId, update);
            return null;
        }
    }

    public void transcript(Long chatId, String file_id) {
        ai.transcriptAudio(chatId, file_id);
    }
}