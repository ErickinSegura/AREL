package com.springboot.MyTodoList.telegram;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.TaskState;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.model.Category;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.BotCommands.TaskCreationCommands;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;

public class CommandHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final MessageSender messageSender;
    private final ServiceManager database;
    private final KeyboardFactory keyboardFactory;
    //private final InactivityManager inactivityManager;
    private final TaskCreationCommands createTask;

    public CommandHandler(MessageSender messageSender, ServiceManager serviceManager, InactivityManager inactivityManager) {
        this.messageSender = messageSender;
        this.database = serviceManager;
        //this.inactivityManager = inactivityManager;
        // Create a new CRUD controller using the ToDoItemService from ServiceManager
        this.keyboardFactory = new KeyboardFactory();
        this.createTask = new TaskCreationCommands(database, messageSender, inactivityManager);
    }

    // Command check methods
    public boolean isStartCommand(String messageText) {
        return messageText.equals(BotCommands.START_COMMAND.getCommand()) ||
                messageText.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel());
    }

    public boolean isHideCommand(String messageText) {
        return messageText.equals(BotCommands.HIDE_COMMAND.getCommand()) ||
                messageText.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel());
    }

    public boolean isListCommand(String messageText) {
        return messageText.equals(BotCommands.TODO_LIST.getCommand()) ||
                messageText.equals(BotLabels.LIST_ALL_ITEMS.getLabel()) ||
                messageText.equals(BotLabels.MY_TODO_LIST.getLabel());
    }

    public boolean isAddItemCommand(String messageText) {
        return messageText.equals(BotCommands.ADD_ITEM.getCommand()) ||
                messageText.equals(BotLabels.ADD_NEW_ITEM.getLabel());
    }

    public void handleCallback(long chatId, String callbackQuery, Update update, UserState state) {
        logger.debug("Got callback query !!! text: " + callbackQuery);
        String[] parts = callbackQuery.split("_");

        //Check callback info

        //Restart
        if (callbackQuery.equals("restart")) {
            handleStartCommand(chatId, update);
        }
        //Developer get info on a task
        else if (callbackQuery.startsWith("taskinfo_")) {
            //Send task info
            handleTaskInfoCallback(callbackQuery, chatId);
        }
        else if (callbackQuery.startsWith("taskManager_")){
            handleManagerTaskOpen(callbackQuery, chatId);
        }
        //Change task state
        else if (callbackQuery.startsWith("set_task_state_")){
            handleSetTaskStateCallback(callbackQuery, chatId, update, state);
        }
        else if (callbackQuery.startsWith("open_project")) {
            int userProjectId = Integer.parseInt(parts[3]);
            String userLevel = parts[2];

            handleOpenProjectCallback(userProjectId, userLevel, chatId);
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
            handleStartCommand(chatId, update);
        }
        else if (callbackQuery.startsWith("open_actual_sprint")) {
            int projectId = Integer.parseInt(parts[3]);

            showSprint(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_assign_task_")) {
            int task_id = Integer.parseInt(parts[3]);

            handleAssignTask(chatId, task_id);
        }
        else if (callbackQuery.startsWith("assign_task_")){
            int task_id = Integer.parseInt(parts[2]);
            int userProjectId = Integer.parseInt(parts[4]);

            assignTask(chatId, task_id, userProjectId, state);
        }
        else if (callbackQuery.startsWith("see_backlog_")) {
            int projectId = Integer.parseInt(parts[2]);

            openBacklog(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_backlog_item_")) {
            int taskId = Integer.parseInt(parts[3]);

            openBacklogItem(chatId, taskId);
        }
        else if (callbackQuery.startsWith("open_sprints_")) { //Available Sprints from a project
            int projectId = Integer.parseInt(parts[2]);

            sprintList(chatId, projectId);
        }
        else if (callbackQuery.startsWith("open_sprint_")) {
            int sprintId = Integer.parseInt(parts[2]);

            openSprint(chatId, sprintId);
        }
        else if (callbackQuery.startsWith("move_task_backlog_")) {
            int taskId = Integer.parseInt(parts[3]);

            moveTaskToBacklog(chatId, taskId);
        }
        else if (callbackQuery.startsWith("add_next_sprint_")) {
            int taskId = Integer.parseInt(parts[3]);

            addToNextSprint(chatId, taskId);
        }
        else if (callbackQuery.startsWith("add_this_sprint_")) {
            int taskId = Integer.parseInt(parts[3]);

            askConfirmation(chatId, taskId);
        }
        else if (callbackQuery.startsWith("confirm_this_sprint_")){
            int taskId = Integer.parseInt(parts[3]);

            addToThisSprint(chatId, taskId);
        }
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
                ResponseEntity<Integer> sprintIdResponse = database.sprint.getActiveSprintId(projectID);
                if (sprintIdResponse.getStatusCode().is2xxSuccessful() && sprintIdResponse.hasBody()) {
                    Integer sprintId = sprintIdResponse.getBody();
                    if (sprintId != null) {
                        task.setSprintId(sprintId);
                        Task response = database.task.updateTask(taskId, task);
                        if (response != null) {
                            message.setText(BotMessages.SUCCESFFULLY_MOVED_TO_CURRENT_SPRINT.getMessage());
                            message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerOpenProject(projectID));
                        }
                    }
                }
            }
        }

        messageSender.sendMessage(message);
    }
    
    public void askConfirmation(Long chatId, int taskId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.ASK_CONFIRMATION_RUNNING_SPRINT.getMessage());
        message.setReplyMarkup(keyboardFactory.confirmAddThisSprint(taskId));
        messageSender.sendMessage(message);
    }

    public void addToNextSprint(Long chatId, int taskId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        message.setText(BotMessages.ADDING_TO_NEXT_SPRINT.getMessage());
        messageSender.sendMessage(message);

        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);
        if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
            Task task = taskResponse.getBody();
            if (task != null) {
                Integer idProject = getProjectIdFromTask(task);
                Optional<Sprint> sprintResponse = database.sprint.getNextSprint(idProject);
                if (sprintResponse.isPresent()) {
                    Sprint sprint = sprintResponse.get();

                    Integer sprintID = sprint.getID();
                    task.setSprintId(sprintID);

                    Task response = database.task.updateTask(taskId, task);

                    if (response != null) {
                        message.setText(BotMessages.SUCCESSFULLY_MOVED_TO_NEXT_SPRINT.getMessage(sprint.getSprintNumber()));
                        message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerOpenProject(idProject));
                    }

                }
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
                task.setSprintId(null);
                task.setProject(projectID);

                Task result = database.task.updateTask(taskId, task);

                if (result != null ) {
                    message.setText(BotMessages.SUCCESSFULLY_MOVED_TO_BACKLOG.getMessage());
                    message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerOpenProject(projectID));
                }
            }
        }

        messageSender.sendMessage(message);
    }

    public void openSprint(Long chatId, int sprintId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        List<Task> sprintTasks = database.task.getTasksBySprintID(sprintId);
        ResponseEntity<Sprint> sprintResponse = database.sprint.getSprintsbyID(sprintId);
        DateTimeFormatter format = DateTimeFormatter.ofPattern("MMM dd", Locale.ENGLISH);

        if (sprintResponse.getStatusCode().is2xxSuccessful() && sprintResponse.hasBody()) {
            Sprint sprint = sprintResponse.getBody();
            if (sprint != null) {

                String sprintInfo = "";
                sprintInfo = "<b>Start Date: </b>" +  sprint.getStartDate().format(format) + "\n<b>End Date: </b>" + sprint.getEndDate().format(format);

                if (sprintTasks.size() > 0) {
                    sprintInfo = sprintInfo + "\n\nClick on one of the tasks below to see its information";
                    message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerTaskList(sprintTasks));
                } else {
                    sprintInfo = sprintInfo + "\n\nThis sprint has no assigned tasks";
                }

                message.setText(BotMessages.OPENED_SPRINT.getMessage(sprint.getSprintNumber(), sprintInfo));   

            }
        }

        messageSender.sendMessage(message);
    }

    public void sprintList(Long chatId, int projectId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        ResponseEntity<List<Sprint>> sprintResponse = database.sprint.getAvailableSprints(projectId);

        if (sprintResponse.getStatusCode().is2xxSuccessful() && sprintResponse.hasBody()){
            List<Sprint> sprintList = sprintResponse.getBody();
            if (sprintList != null && !sprintList.isEmpty() && sprintList.size()>0) {
                message.setText(BotMessages.OPENED_SPRINTS.getMessage());

                int currentSprint = database.project.getActiveSprint(projectId);
                message.setReplyMarkup(keyboardFactory.sprintList(sprintList, currentSprint));
            }else {
                message.setText(BotMessages.NO_SPRINTS_AVAILABLE.getMessage());
            }
        }else {
            message.setText(BotMessages.ERROR_DATABASE.getMessage());
        }

        messageSender.sendMessage(message);
    }

    public void openBacklogItem(Long chatId, int taskId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);

        if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
            Task task = taskResponse.getBody();
            if (task != null) {
                message.setText(task.getCoolFormatedString());
                message.setReplyMarkup(keyboardFactory.taskInfoBacklog(task));
    
            }else {
                message.setText(BotMessages.ERROR_DATABASE.getMessage());
            }
        }

        messageSender.sendMessage(message);
    }

    public void openBacklog(Long chatId, int projectId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        List<Task> backlog = database.task.getBacklog(projectId);
        if (backlog.size() > 0 && !backlog.isEmpty()) {

            message.setText(BotMessages.OPENED_BACKLOG.getMessage());
            message.setReplyMarkup(keyboardFactory.inlineKeyboardBacklogList(backlog));

        }else {
            message.setText(BotMessages.NO_ITEMS_IN_BACKLOG.getMessage());
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

    public Integer getProjectIdFromTask(Task task) {
        if (task.getProjectId() != null) {
            return task.getProjectId();
        } else {
            Integer idResponse = database.sprint.getProjectbyId(task.getSprintId());
            if (idResponse != null) {
                return idResponse;
            }
            else {
                return null;
            }
        }
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

    public void showSprint(Long chatId, int projectId) {
        Integer activeSprint = database.project.getActiveSprint(projectId);
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        if (activeSprint != null) {
            List<Task> sprintTasks = database.task.getTasksBySprintID(activeSprint);

            if (sprintTasks.size() > 0) {
                message.setText(BotMessages.LIST_SPRINT.getMessage());
                message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerTaskList(sprintTasks));
            } else {
                //Null, no active sprint
                message.setText(BotMessages.NO_ACTIVE_SPRINT.getMessage());
            }
        }else {
            //Null, no active sprint
            message.setText(BotMessages.NO_ACTIVE_SPRINT.getMessage());
        }

        messageSender.sendMessage(message);
    }

    public void handleStartCommand(long chatId, Update update) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        try {

            String username = "";
            //Get user and privileges
            if (update.hasMessage()) {
                username = update.getMessage().getFrom().getUserName();
            } else if (update.hasCallbackQuery()) {
                username = update.getCallbackQuery().getFrom().getUserName();
            }
            
            ResponseEntity<User> userResponse = database.user.getUserByTelegramUsername(username);
            User user = Optional.ofNullable(userResponse.getBody())
                    .orElseThrow(() -> new RuntimeException("User not found, or couldn't reach database."));
            String userLevelLabel = user.getUserLevel().getLabel();
            
            //Fetch all available projects to user
            List<UserProject> userProjectList = database.userProject.getProjectsByUser(user.getId());

            //No project assigned
            if (userProjectList.isEmpty()){
                message.setText(BotMessages.NO_PROJECT_ASSIGNED.getMessage(user.getFirstName()));
            }

            if (userLevelLabel.equals("Developer")) {
                //Dev
                if (userProjectList.size() == 1) { // Only 1 project assigned
                    UserProject actualUserProject = userProjectList.get(0);
                    Project actualProject = actualUserProject.getProject();
                    //Get project tasks
                    List<Task> taskList = database.task.getTasksByUserProject(actualUserProject.getID());
                    message.setReplyMarkup(keyboardFactory.createInlineKeyboardFromTasks(taskList));
                    message.setText(BotMessages.PROJECT_AVAILABLE.getMessage(user.getFirstName(), actualProject.getName(), actualUserProject.getRole()));

                }else if(userProjectList.size() > 1) { // Multiple projects assigned
                    message.setText(BotMessages.MULTIPLE_PROJECTS_AVAILABLE.getMessage(user.getFirstName()));
                    message.setReplyMarkup(keyboardFactory.multipleProjectList(userProjectList, userLevelLabel));

                }
            } else if (userLevelLabel.equals("Manager")) {
                //Manager
                message.setText(BotMessages.WELCOME_MANAGER.getMessage(user.getFirstName()));
                message.setReplyMarkup(keyboardFactory.multipleProjectList(userProjectList, userLevelLabel));
            }

        } catch (Exception e) {
            message.setText(e.getMessage());
            logger.error("Error retrieving user: {}", e.getMessage(), e);
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
                        message.setText("Congratulations on completing your ticket! Now enter how many hours took you to complete it:");
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

    //Open project information
    public void handleOpenProjectCallback(int userProjectId, String userLevel, long chatId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        Optional<UserProject> userProjectOptional = database.userProject.getUserProjectByID(userProjectId);
        if (userProjectOptional.isPresent()) {
            UserProject userProject = userProjectOptional.get();
            Project actualProject = userProject.getProject();

            if (userLevel.equals("Developer")) {
                //Get project tasks
                List<Task> taskList = database.task.getTasksByUserProject(userProject.getID());
                String noTask = "";
                if (taskList.size() == 0 ) {
                    noTask = "\n\nNo tasks available";
                }

                message.setReplyMarkup(keyboardFactory.createInlineKeyboardFromTasks(taskList));
                message.setText(BotMessages.DEV_OPEN_PROJECT.getMessage(actualProject.getName(), userProject
                .getRole()) + noTask);
    
            } else if (userLevel.equals("Manager")) {
                //Mock Data
                String dataString = "";
                dataString = "(MOCK DATA, NOT REAL)"
                +"\n"
                +"<b>" + actualProject.getName() + "</b>"
                +"\n\n"
                +"This sprint's completed tasks:"
                +"\n"
                +"15/<b>29</b>"
                +"\n\n"
                +"Click one of the options below to see/manage this project."
                ;

                message.setText(dataString);
                message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerOpenProject(actualProject.getID()));
            }

            messageSender.sendMessage(message);
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

        }
        //default
        else {
            message.setText(BotMessages.DEFAULT_MESSAGE_START.getMessage());
        }

        messageSender.sendMessage(message);
    }
}