package com.springboot.MyTodoList.telegram;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;

import com.springboot.MyTodoList.controller.ToDoItemBotCrudController;
import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.TaskState;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;

public class CommandHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final MessageSender messageSender;
    private final ServiceManager database;
    private final ToDoItemBotCrudController crudController;
    private final KeyboardFactory keyboardFactory;

    public CommandHandler(MessageSender messageSender, ServiceManager serviceManager) {
        this.messageSender = messageSender;
        this.database = serviceManager;
        // Create a new CRUD controller using the ToDoItemService from ServiceManager
        this.crudController = new ToDoItemBotCrudController(serviceManager.todoItem);
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

    public void handleCallback(long chatId, String callbackQuery, Update update) {
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
                message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerOpenProject());
            }

            messageSender.sendMessage(message);
        }
    }
}