package com.springboot.MyTodoList.telegram.BotCommands;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.KeyboardFactory;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;
import com.springboot.MyTodoList.util.BotMessages;

public class AgileCommands {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final ServiceManager database;
    private final MessageSender messageSender;
    private final KeyboardFactory keyboardFactory;

    public AgileCommands(ServiceManager database, MessageSender messageSender,
                                    InactivityManager inactivityManager) {
        this.database = database;
        this.messageSender = messageSender;
        this.keyboardFactory = new KeyboardFactory();
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
    
            } else if (userLevel.equals("Manager") || userLevel.equals("Administrator")) {
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

    //#region Sprint
    public void openSprint(Long chatId, int sprintId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        List<Task> sprintTasks = database.task.getTasksBySprintID(sprintId);
        Optional<Sprint> sprintResponse = database.sprint.getSprintsbyID(sprintId);
        DateTimeFormatter format = DateTimeFormatter.ofPattern("MMM dd", Locale.ENGLISH);

        if (sprintResponse.isPresent()) {
            Sprint sprint = sprintResponse.get();
            if (sprint != null) {

                String sprintInfo = "";
                String startDate = sprint.getStartDate().format(format);
                String endDate = sprint.getEndDate().format(format);
                sprintInfo = "<b>Start Date: </b>" + startDate + "\n<b>End Date: </b>" + endDate;

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

    public void askSprintStartDate(Long chatId, int projectId, UserState state) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        message.setText(BotMessages.CREATE_SPRINT_ENTER_STARTDATE.getMessage());
        state.setState(UserStateType.CREATE_SPRINT_ENTER_STARTDATE);
        Sprint actualSprint = state.getSprintCreation();
        actualSprint.setProject(projectId);
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

    public void setSprintStartDate(String messageText, UserState state, SendMessage message) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            LocalDate sprintStarDate = LocalDate.parse(messageText, formatter);
            LocalDateTime sprintStartDateTime = sprintStarDate.atStartOfDay();
            Sprint actualSprint = state.getSprintCreation();
            actualSprint.setStartDate(sprintStartDateTime);
            state.setState(UserStateType.CREATE_SPRINT_ENTER_ENDDATE);
            message.setText(BotMessages.CREATE_SPRINT_ENTER_ENDDATE.getMessage());
        }
        catch (DateTimeParseException e) {
            message.setText(BotMessages.CREATE_SPRINT_PARSE_ERROR.getMessage());
        }
    }

    public void setSprintEndDate(String messageText, UserState state, SendMessage message) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            LocalDate sprintEndDate = LocalDate.parse(messageText, formatter);
            LocalDateTime sprintEndDateTime = sprintEndDate.atTime(23,59);
            Sprint actualSprint = state.getSprintCreation();
            actualSprint.setEndDate(sprintEndDateTime);
            
            Sprint response = database.sprint.addSprint(actualSprint);
            Integer newNumber = database.sprint.getSprintNumberById(response.getID());

            message.setText(BotMessages.CREATE_SPRINT_CONFIRMATION.getMessage(newNumber));
            message.setReplyMarkup(keyboardFactory.inlineKeyboardManagerOpenProject(actualSprint.getProject()));
        }
        catch (DateTimeParseException e) {
            message.setText(BotMessages.CREATE_SPRINT_PARSE_ERROR.getMessage());
        }
    }

    //#region Start Command
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

                    String firstName = user.getFirstName();
                    String project = actualProject.getName();
                    String actualUP = actualUserProject.getRole();
                    message.setText(BotMessages.PROJECT_AVAILABLE.getMessage(firstName, project, actualUP));

                }else if(userProjectList.size() > 1) { // Multiple projects assigned
                    message.setText(BotMessages.MULTIPLE_PROJECTS_AVAILABLE.getMessage(user.getFirstName()));
                    message.setReplyMarkup(keyboardFactory.multipleProjectList(userProjectList, userLevelLabel));

                }
            } else if (userLevelLabel.equals("Manager") || userLevelLabel.equals("Administrator")) {
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

}
