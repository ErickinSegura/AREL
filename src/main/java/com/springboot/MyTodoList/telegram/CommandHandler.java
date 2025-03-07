package com.springboot.MyTodoList.telegram;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;

import com.springboot.MyTodoList.controller.ToDoItemBotCrudController;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;

public class CommandHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    private final MessageSender messageSender;
    private final ToDoItemBotCrudController crudController;
    private final UserService userService;
    private final KeyboardFactory keyboardFactory;

    public CommandHandler(MessageSender messageSender, ToDoItemBotCrudController crudController, UserService userService) {
        this.messageSender = messageSender;
        this.crudController = crudController;
        this.userService = userService;
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

    // Command handlers
    public void handleStartCommand(long chatId, Update update) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);

        try {
            String username = update.getMessage().getFrom().getUserName();
            ResponseEntity<User> userResponse = userService.getUserByTelegramUsername(username);

            User user = Optional.ofNullable(userResponse.getBody())
                    .orElseThrow(() -> new RuntimeException("User not found, or couldn't reach database."));

            String userLevelLabel = user.getUserLevel().getLabel();
            message.setText("Welcome, " + user.getFirstName() + "! Loading " + userLevelLabel + " view. Jelyea");
        } catch (Exception e) {
            message.setText("Error: User " + update.getMessage().getFrom().getUserName() + " not found...");
            logger.error("Error retrieving user: {}", e.getMessage(), e);
        }

        message.setReplyMarkup(keyboardFactory.createMainMenuKeyboard());
        messageSender.sendMessage(message);
    }

    public void handleDoneCommand(String messageText, long chatId) {
        try {
            int id = extractId(messageText);
            ToDoItem item = crudController.getToDoItemById(id).getBody();

            if (item != null) {
                item.setDone(true);
                crudController.updateToDoItem(item, id);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), messageSender.getBot());
            } else {
                BotHelper.sendMessageToTelegram(chatId, "Error: Item not found.", messageSender.getBot());
            }
        } catch (Exception e) {
            logger.error("Error marking item as done: {}", e.getMessage(), e);
            messageSender.sendErrorMessage(chatId);
        }
    }

    public void handleUndoCommand(String messageText, long chatId) {
        try {
            int id = extractId(messageText);
            ToDoItem item = crudController.getToDoItemById(id).getBody();

            if (item != null) {
                item.setDone(false);
                crudController.updateToDoItem(item, id);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_UNDONE.getMessage(), messageSender.getBot());
            } else {
                BotHelper.sendMessageToTelegram(chatId, "Error: Item not found.", messageSender.getBot());
            }
        } catch (Exception e) {
            logger.error("Error marking item as undone: {}", e.getMessage(), e);
            messageSender.sendErrorMessage(chatId);
        }
    }

    public void handleDeleteCommand(String messageText, long chatId) {
        try {
            int id = extractId(messageText);
            crudController.deleteToDoItem(id);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DELETED.getMessage(), messageSender.getBot());
        } catch (Exception e) {
            logger.error("Error deleting item: {}", e.getMessage(), e);
            messageSender.sendErrorMessage(chatId);
        }
    }

    public void handleHideCommand(long chatId) {
        BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), messageSender.getBot());
    }

    public void handleListCommand(long chatId) {
        try {
            List<ToDoItem> allItems = crudController.getAllToDoItems();
            SendMessage message = new SendMessage();
            message.setChatId(chatId);
            message.setText(BotLabels.MY_TODO_LIST.getLabel());
            message.setReplyMarkup(keyboardFactory.createToDoListKeyboard(allItems));
            messageSender.sendMessage(message);
        } catch (Exception e) {
            logger.error("Error listing items: {}", e.getMessage(), e);
            messageSender.sendErrorMessage(chatId);
        }
    }

    public void handleAddItemCommand(long chatId) {
        try {
            SendMessage message = new SendMessage();
            message.setChatId(chatId);
            message.setText(BotMessages.TYPE_NEW_TODO_ITEM.getMessage());
            message.setReplyMarkup(new ReplyKeyboardRemove(true));
            messageSender.sendMessage(message);
        } catch (Exception e) {
            logger.error("Error preparing to add item: {}", e.getMessage(), e);
            messageSender.sendErrorMessage(chatId);
        }
    }

    public void handleNewItemCreation(String messageText, long chatId) {
        try {
            ToDoItem newItem = new ToDoItem();
            newItem.setDescription(messageText);
            newItem.setCreation_ts(OffsetDateTime.now());
            newItem.setDone(false);
            crudController.addToDoItem(newItem);

            SendMessage message = new SendMessage();
            message.setChatId(chatId);
            message.setText(BotMessages.NEW_ITEM_ADDED.getMessage());
            messageSender.sendMessage(message);
        } catch (Exception e) {
            logger.error("Error creating new item: {}", e.getMessage(), e);
            messageSender.sendErrorMessage(chatId);
        }
    }

    // Helper methods
    private int extractId(String messageText) {
        String idStr = messageText.substring(0, messageText.indexOf(BotLabels.DASH.getLabel()));
        return Integer.parseInt(idStr);
    }
}