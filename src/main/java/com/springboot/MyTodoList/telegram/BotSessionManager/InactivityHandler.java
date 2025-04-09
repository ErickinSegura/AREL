package com.springboot.MyTodoList.telegram.BotSessionManager;
import java.util.concurrent.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.springboot.MyTodoList.telegram.CommandHandler;

public class InactivityHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);
    private static final int TIMEOUT = 5; //Minutes
    private ScheduledExecutorService scheduler;
    private ScheduledFuture<?> inactivityTask;
    private Runnable deleteCallback;

    public UserState state;

    public InactivityHandler(Runnable deleteCallback) {
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
        this.deleteCallback = deleteCallback;
        this.state = new UserState();
        resetInactividad(); // Reactivate
    }

    public void resetInactividad() {
        if (inactivityTask != null && !inactivityTask.isCancelled()) {
            inactivityTask.cancel(false);
        }

        inactivityTask = scheduler.schedule(() -> {
            //User inactive, delete
            deleteCallback.run();
            stop();
        }, TIMEOUT, TimeUnit.MINUTES);

        logger.debug("📩 Timer reset");
    }

    public void stop() {
        if (inactivityTask != null) {
            inactivityTask.cancel(false);
        }
        scheduler.shutdown();
    }

    public UserState getState() { 
        return state;
    }

    public void setState(UserState newState) {
        this.state = newState;
    }
}
