package com.springboot.MyTodoList.telegram.BotCommands;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.KeyboardFactory;
import com.springboot.MyTodoList.telegram.MessageSender;

public class AICommands {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final ServiceManager database;
    private final MessageSender messageSender;
    private final KeyboardFactory keyboardFactory;

    public AICommands(ServiceManager database, MessageSender messageSender) {
        this.database = database;
        this.messageSender = messageSender;
        this.keyboardFactory = new KeyboardFactory();
    }

    public void sendPrompt(Long chatId, String prompt) {
        logger.info("starting prompt with open ai, prompt: " + prompt);
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        ResponseEntity<String> stringResponse = database.ai.prompt(prompt);

        if (stringResponse.getStatusCode().is2xxSuccessful() && stringResponse.hasBody()) {
            String response = stringResponse.getBody();
            logger.info("Response received from open ai, response: " + response);
            if (response == null || response.isEmpty()){
                logger.error("AI Response Empty...");
                return; //Nothing, lmao
            }else{
                message.setText(response);
            }
        } else {
            logger.error("Error retrieving ai response in command /ai: " + stringResponse.toString());
        }

        messageSender.sendMessage(message);
    }
}