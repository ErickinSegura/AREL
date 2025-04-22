package com.springboot.MyTodoList.telegram.BotCommands;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.SprintOverview;
import com.springboot.MyTodoList.model.UserPerformance;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.KeyboardFactory;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.util.BotMessages;

public class KPICommands {

    private final ServiceManager database;
    private final MessageSender messageSender;
    private final KeyboardFactory keyboardFactory;

    public KPICommands(ServiceManager database, MessageSender messageSender) {
        this.database = database;
        this.messageSender = messageSender;
        this.keyboardFactory = new KeyboardFactory();
    }

    public void openKPISprint(Long chatId, Integer projectId, Integer sprintId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        List<SprintOverview> sprintOverviews = database.kpi.getSprintOverviewsByProjectId(Long.valueOf(projectId));
        
        Optional<SprintOverview> activeSprintOverviewOptional = sprintOverviews.stream()
        .filter(p -> p.getSprintNumber() == sprintId)
        .findFirst();

        if (activeSprintOverviewOptional.isPresent()) {
            SprintOverview sprintOverview = activeSprintOverviewOptional.get();
            message.setText(formatSprintOverview(sprintOverview) 
            + "\n\n"
            + BotMessages.KPI_OPEN.getMessage());
            message.setReplyMarkup(keyboardFactory.inlineKPIMenu(projectId));
        }

        messageSender.sendMessage(message);
    }

    public void openKPIUser(Long chatId, Integer userProjectId, Integer projectId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        ResponseEntity<List<Sprint>> responseEntitySprints = database.sprint.getSprintsByProjectID(projectId);

        if ( responseEntitySprints.getStatusCode().is2xxSuccessful() && responseEntitySprints.hasBody()) {
            List<Sprint> sprints = responseEntitySprints.getBody();
            if (sprints != null && sprints.size() > 0) {
                message.setText(BotMessages.KPI_OPEN_USER_SPRINT.getMessage());
                message.setReplyMarkup(keyboardFactory.inlineKPIUserSprintList(sprints, userProjectId, projectId));
            }else{
                message.setText(BotMessages.NO_SPRINTS_AVAILABLE.getMessage());
            }
        }

        messageSender.sendMessage(message);
    }

    public void openKPIUserSprint(Long chatId, Integer sprintNumber, Integer userProjectID, Integer projectID) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        List<UserPerformance> userPerformances = database.kpi.getUserPerformancesByProjectId(Long.valueOf(projectID));

        Optional<UserPerformance> userPerformanceOptional = userPerformances.stream()
        .filter(p -> p.getUserProjectID() == userProjectID && p.getSprintNumber() == sprintNumber)
        .findFirst();

        if (userPerformanceOptional.isPresent()) {
            UserPerformance userPerformance = userPerformanceOptional.get();

            message.setText(formatUserPerformance(userPerformance)
                            + "\n\n"
                            + BotMessages.KPI_SEE_MORE.getMessage());
            message.setReplyMarkup(keyboardFactory.inlineKPISeeMore(projectID, userProjectID, 
                                   userPerformance.getUserName()));
        }

        messageSender.sendMessage(message);
    }

    public void openKPIMenu(Long chatId, Integer projectId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        message.setText(BotMessages.KPI_OPEN.getMessage());
        message.setReplyMarkup(keyboardFactory.inlineKPIMenu(projectId));

        messageSender.sendMessage(message);
    }

    public void KPIMenuSprints(Long chatId, Integer projectId){
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        ResponseEntity<List<Sprint>> sprintsResponse = database.sprint.getSprintsByProjectID(projectId);

        if ( sprintsResponse.getStatusCode().is2xxSuccessful() && sprintsResponse.hasBody() ) {
            List<Sprint> sprints = sprintsResponse.getBody();
            if (sprints != null && sprints.size() > 0) {
                message.setText(BotMessages.KPI_OPEN_SPRINTS.getMessage());
                message.setReplyMarkup(keyboardFactory.inlineKPISprintList(sprints));

            }else{
                message.setText(BotMessages.NO_SPRINTS_AVAILABLE.getMessage());
            }
        }

        messageSender.sendMessage(message);
    }

    public void KPIMenuUsers(Long chatId, Integer projectId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        List<UserProject> userProjects = database.userProject.getUsersByProject(projectId);
        if (userProjects.size() > 0){
            message.setText(BotMessages.KPI_OPEN_USERS.getMessage());
            message.setReplyMarkup(keyboardFactory.inlineKPIUserList(userProjects));
        }else{
            message.setText(BotMessages.NO_USERS_IN_PROJECT.getMessage());
        }

        messageSender.sendMessage(message);
    }

    public void getOverview(Long chatId, Long projectId, int activeSprint) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(BotMessages.ERROR_DATABASE.getMessage());

        List<SprintOverview> sprintOverviews = database.kpi.getSprintOverviewsByProjectId(projectId);

        Optional<SprintOverview> activeSprintOverviewOptional = sprintOverviews.stream()
        .filter(p -> p.getSprintNumber() == activeSprint)
        .findFirst();

        if ( activeSprintOverviewOptional.isPresent() ) {
            SprintOverview activeSprintOverview = activeSprintOverviewOptional.get();
            message.setText(formatSprintOverview(activeSprintOverview));
        }

        messageSender.sendMessage(message);
    }

    public String formatSprintOverview(SprintOverview sprintOverview) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM");
        String startDate = sprintOverview.getStartDate().format(formatter);
        String endDate = sprintOverview.getEndDate().format(formatter);

        String feedback;

        int completionRate = 0;
        if (sprintOverview.getTotalTasks() != 0) {
            completionRate = (int) (sprintOverview.getCompletedTasks()*100/sprintOverview.getTotalTasks());
        }

        if (completionRate == 100) {
            feedback = "🎉 Sprint fully completed! Amazing work, team!";
        } else if (completionRate >= 75) {
            feedback = "🚀 Great progress! You're " + completionRate + "% done. Keep it up!";
        } else if (completionRate >= 40) {
            feedback = "🛠️ You're making steady progress: " + completionRate + "% completed.";
        } else if (completionRate > 0) {
            feedback = "🔄 Just getting started: " + completionRate + "% done. Let’s keep moving!";
        } else {
            feedback = "⏳ No tasks completed yet. Time to kick things off!";
        }
        
        return "<b>Sprint #" + 
        sprintOverview.getSprintNumber() + 
        " - " + 
        sprintOverview.getProjectName() +
        "</b>\n" +
        "From " + startDate + " to " + endDate +
        "\n\n<b>Sprint Status</b>\n" +
        sprintOverview.getCompletedTasks() +
        " of " + sprintOverview.getTotalTasks() +
        " tickets completed!" + 
        "\n" + 
        sprintOverview.getTotalRealHours() +
        " worked hours (vs. " +
        sprintOverview.getTotalEstimatedHours() +
        " estimated)\n\n" +
        feedback
        ;
    }

    public String formatUserPerformance(UserPerformance data) {
        String message = "";
    
        message += "📊 <b>Performance Summary - " + data.getUserName() + "\n";
        message += data.getProjectName() + "</b>\n";
        message += "Sprint #" + data.getSprintNumber() + "\n\n";
    
        message += data.getAssignedTasks() + " Assigned Tasks " + "\n";
        message += data.getCompletedTasks() + " Completed Tasks: " + " (" + (int) data.getCompletionRate() + "%)\n\n";
        message += "Estimated Hours: " + data.getTotalEstimatedHours() + "h\n";
        message += "Actual Hours: " + data.getTotalRealHours() + "h\n";
    
        if (data.getCompletionRate() == 100) {
            message += "🎉 Excellent! All tasks completed. Keep it up!";
        } else if (data.getCompletionRate() >= 75) {
            message += "🚀 Great job! Most tasks are done. You're on track.";
        } else if (data.getCompletionRate() >= 40) {
            message += "🛠️ Progressing steadily. Keep pushing forward!";
        } else if (data.getCompletionRate() > 0) {
            message += "🔄 Still early. Let’s try to wrap up more tasks.";
        } else {
            message += "⏳ No completed tasks yet. Let's get started!";
        }

        return message;
    }
}
