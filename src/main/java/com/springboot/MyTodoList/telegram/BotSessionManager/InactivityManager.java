package com.springboot.MyTodoList.telegram.BotSessionManager;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.util.BotMessages;

public class InactivityManager {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);
    private static final Map<Long, InactivityHandler> userStates = new ConcurrentHashMap<>();
    private final MessageSender messageSender;

    public InactivityManager(MessageSender messageSender) {
        this.messageSender = messageSender;
    }

    public void receivedMessageFrom(Long idChat) {
        userStates.compute(idChat, (key, handler) -> {
            if (handler == null) {
                // New user
                return new InactivityHandler(() -> {
                    deleteUser(key);
                });
            }
            // If exists, reset timer
            handler.resetInactividad();
            
            return handler;
        });

        logger.debug("Message received from " + idChat + ". timer reset.");
    }

    public void deleteUser(Long idChat) {
        //Send message
        SendMessage message = new SendMessage();
        message.setChatId(idChat);
        message.setText(BotMessages.DISCONNECTING.getMessage());
        messageSender.sendMessage(message);


        logger.debug("Chat " + idChat + " is now inactive. Deleting from system.");
        userStates.remove(idChat);
    }

    public UserState getUserState(Long idChat) {
        InactivityHandler userState = userStates.get(idChat);
        return (userState != null) ? userState.getState() : null;
    }

    public void setUserState(Long idChat, UserStateType state) {
        //Get State
        InactivityHandler handler = userStates.get(idChat);
        UserState userState = handler.getState();

        //Set new State
        userState.setState(state);
        handler.setState(userState);
    }

    public boolean isUserActive(Long idChat) {
        return userStates.containsKey(idChat);
    }
}
