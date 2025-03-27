package com.springboot.MyTodoList.telegram.BotSessionManager;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.springboot.MyTodoList.telegram.CommandHandler;

public class InactivityManager {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);
    private static final Map<Long, InactivityHandler> userStates = new ConcurrentHashMap<>();

    public void receivedMessageFrom(Long idUser) {
        userStates.compute(idUser, (key, handler) -> {
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

        logger.debug("Message received from " + idUser + ". timer reset.");
    }

    public static void deleteUser(Long idUser) {
        logger.debug("User " + idUser + " is now inactive. Deleting from system.");
        userStates.remove(idUser);
    }

    public UserState getUserState(Long idUser) {
        InactivityHandler userState = userStates.get(idUser);
        return (userState != null) ? userState.getState() : null;
    }

    public void setUserState(Long idUser, UserState state) {
        InactivityHandler userState = userStates.get(idUser);
        userState.setState(state);
    }
}
