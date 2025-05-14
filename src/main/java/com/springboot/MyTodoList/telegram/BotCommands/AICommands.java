package com.springboot.MyTodoList.telegram.BotCommands;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.MessageSender;

public class AICommands {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final ServiceManager services;
    private final MessageSender messageSender;

    public AICommands(ServiceManager services, MessageSender messageSender) {
        this.services = services;
        this.messageSender = messageSender;
    }

    public void sendPrompt(Long chatId, String prompt) {
        logger.info("starting prompt with open ai, prompt: " + prompt);
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        ResponseEntity<String> stringResponse = services.ai.prompt(prompt);

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


    //#region Audio Handling
    public void transcriptAudio(Long chatId, String fileId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText("Handling voicenote...");

        ResponseEntity<String> response = services.ai.transcript(fileId);
        if (response.getStatusCode().is2xxSuccessful() && response.hasBody()) {
            String string = response.getBody();
            message.setText(string);
        }

        messageSender.sendMessage(message);
    }
}