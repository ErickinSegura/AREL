package com.springboot.MyTodoList.telegram;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.TaskPriority;
import com.springboot.MyTodoList.model.TaskState;
import com.springboot.MyTodoList.model.TaskType;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.model.Category;
import com.springboot.MyTodoList.service.ServiceManager;
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
    private final InactivityManager inactivityManager;

    public CommandHandler(MessageSender messageSender, ServiceManager serviceManager, InactivityManager inactivityManager) {
        this.messageSender = messageSender;
        this.database = serviceManager;
        this.inactivityManager = inactivityManager;
        // Create a new CRUD controller using the ToDoItemService from ServiceManager
        this.keyboardFactory = new KeyboardFactory();
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

        //Check callback info

        //Restart
        if (callbackQuery.equals("restart")) {
            handleStartCommand(chatId, update);
        }
        //Developer get info on a task
        else if (callbackQuery.startsWith("taskinfo_")) {
            //Send task info
            handleTaskInfoCallback(callbackQuery, chatId, update);
        }
        //Change task state
        else if (callbackQuery.startsWith("set_task_state_")){
            handleSetTaskStateCallback(callbackQuery, chatId, update);
        }
        else if (callbackQuery.startsWith("open_project")) {
            String[] parts = callbackQuery.split("_");
    
            int userProjectId = Integer.parseInt(parts[3]);
            String userLevel = parts[2];

            handleOpenProjectCallback(userProjectId, userLevel, chatId);
        }
        else if (callbackQuery.startsWith("create_task_project_")) {
            handleCreateTask(callbackQuery, chatId);
        }
        else if (callbackQuery.startsWith("set_statetask_category_")) {
            handleSetCategory(chatId, callbackQuery, state);
        }
        else if (callbackQuery.startsWith("set_statetask_type_")) {
            String[] parts = callbackQuery.split("_");
            int type_id = Integer.parseInt(parts[3]);
            String type_label = parts[4];

            handleSetType(chatId, state, type_id, type_label);
        }
        else if (callbackQuery.startsWith("set_statetask_priority_")) {
            String[] parts = callbackQuery.split("_");
            int priorityId = Integer.parseInt(parts[3]);
            String priorityLabel = parts[4];

            handleSetPriority(chatId, state, priorityId, priorityLabel);
            previewTask(chatId, state);
        }
        else if (callbackQuery.equals("save_task")) {
            //Save task
            handleSave(chatId, state);
        }
        else if (callbackQuery.equals("cancel_task_creation")) {
            //Cancel everything
            handleCancel(chatId, state);
            handleStartCommand(chatId, update);
        }
    }

    public void handleSave(Long chatId, UserState state) {
        TaskState newState = new TaskState();
        newState.setID(1);
        newState.setLabel("todo");

        Task task = state.getTask();
        task.setState(newState);

        database.task.addTask(task);

        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.SAVE_TASK.getMessage());
        messageSender.sendMessage(message);
    }

    public void handleCancel(Long chatId, UserState state) {
        //Delete task
        state.setTask(null);

        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.CANCEL_TASK_CREATION.getMessage());
        messageSender.sendMessage(message);
    }

    public void previewTask(Long chatId, UserState state) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        Task actualTask = state.getTask();
        message.setText(BotMessages.CREATE_TASK_PREVIEW.getMessage(actualTask.previewString()));
        message.setReplyMarkup(keyboardFactory.inlineKeyboardPreview());

        messageSender.sendMessage(message);
    }

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

    // Command handlers
    public void handleStartCommand(long chatId, Update update) {
        logger.debug("STARTING HANDLESTART COMMAND");
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
            List<UserProject> userProjectList = database.userProject.getProjectsByUser(user.getID());

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
    public void handleTaskInfoCallback(String callbackQuery, long chatId, Update update) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        
        try { 
            String taskIdString = callbackQuery.replace("taskinfo_", "");
            int taskId = Integer.parseInt(taskIdString);

            ResponseEntity<Task> taskResponse = database.task.getTaskById(taskId);
            if (taskResponse.getStatusCode().is2xxSuccessful() && taskResponse.hasBody()) {
                Task task = taskResponse.getBody();
                message.setText(task.getCoolFormatedString());

                message.setReplyMarkup(keyboardFactory.taskInfoInLineKeyboard(task));
            } else {
                throw new RuntimeException("Error in server response: " + taskResponse.getStatusCode());
            }
        } catch (Exception e) {
            message.setText(BotMessages.TASK_UNAVAILABLE.getMessage() + "\n\n" + e.getLocalizedMessage());
        }

        messageSender.sendMessage(message);
    }

    public void handleSetTaskStateCallback(String callbackQuery, long chatId, Update update) {
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
                taskToEdit.setState(newState);

                database.task.updateTask(taskId, taskToEdit);

                message.setText("Successfully changed task to state: " + newState.formatted());

            }

        }catch (Exception e) {
            message.setText(e.getLocalizedMessage());
        }

        messageSender.sendMessage(message);
    }

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

    public void handleSetTitle(UserState state, String messageText) {
        //Save task title
        Task actualTask = state.getTask();
        actualTask.setTitle(messageText);
        state.setTask(actualTask);

        //Next, user will enter description
        state.setState(UserStateType.CREATE_TASK_ENTER_DESCRIPTION);
    }

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

    public void handleSetCategory(UserState state, String messageText) {
        
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
            handleSetTitle(state, messageText);
            
        } else if (state.getState() == UserStateType.CREATE_TASK_ENTER_DESCRIPTION) {
            message.setText(BotMessages.CREATE_TASK_SET_CATEGORY.getMessage());
            List<Category> categories = handleSetDescription(state, messageText);
            message.setReplyMarkup(keyboardFactory.inlineKeyboardCategorySet(categories));
        } else if (state.getState() == UserStateType.CREATE_TASK_ENTER_CATEGORY) {
            message.setText(messageText);

        //default
        } else {
            message.setText(BotMessages.DEFAULT_MESSAGE_START.getMessage());
        }

        messageSender.sendMessage(message);
    }
}