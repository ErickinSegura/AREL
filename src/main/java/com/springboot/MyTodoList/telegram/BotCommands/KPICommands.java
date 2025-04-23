package com.springboot.MyTodoList.telegram.BotCommands;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import com.springboot.MyTodoList.model.SprintOverview;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.KeyboardFactory;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;

public class KPICommands {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final ServiceManager database;
    private final MessageSender messageSender;
    private final KeyboardFactory keyboardFactory;
    private final InactivityManager inactivityManager;

    public KPICommands(ServiceManager database, MessageSender messageSender,
                                InactivityManager inactivityManager) {
        this.database = database;
        this.messageSender = messageSender;
        this.keyboardFactory = new KeyboardFactory();
        this.inactivityManager = inactivityManager;
    }

    public void getOverview(Long chatId, int projectId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        List<SprintOverview> sprintOverviews = database.kpi.getSprintOverviewsByProjectId(chatId);

        message.setText(sprintOverviews.toString());

        messageSender.sendMessage(message);
    }
}
