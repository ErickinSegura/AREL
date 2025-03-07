package com.springboot.MyTodoList.telegram;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

public class MessageSender {
    private static final Logger logger = LoggerFactory.getLogger(MessageSender.class);

    private final TelegramLongPollingBot bot;

    public MessageSender(TelegramLongPollingBot bot) {
        this.bot = bot;
    }

    public void sendMessage(SendMessage message) {
        try {
            bot.execute(message);
        } catch (TelegramApiException e) {
            logger.error("Error sending message: {}", e.getMessage(), e);
        }
    }

    public void sendErrorMessage(long chatId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText("Something went wrong. Please try again.");
        sendMessage(message);
    }

    public TelegramLongPollingBot getBot() {
        return bot;
    }
}