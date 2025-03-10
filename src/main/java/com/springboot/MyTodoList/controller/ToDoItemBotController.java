package com.springboot.MyTodoList.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.ToDoItemService;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;

public class ToDoItemBotController extends TelegramLongPollingBot {

	private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
	private final String botName;
	private final CommandHandler commandHandler;
	private final MessageSender messageSender;

    public ToDoItemBotController(String botToken, String botName, ToDoItemService toDoItemService, UserService userService) {
		super(botToken);
		logger.info("Bot Token: {}", botToken);
		logger.info("Bot name: {}", botName);
		this.botName = botName;
		this.messageSender = new MessageSender(this);
        ToDoItemBotCrudController crudController = new ToDoItemBotCrudController(toDoItemService);
		this.commandHandler = new CommandHandler(this.messageSender, crudController, userService);
	}

	@Override
	public void onUpdateReceived(Update update) {
		if (!update.hasMessage() || !update.getMessage().hasText()) {
			return;
		}

		String messageText = update.getMessage().getText();
		long chatId = update.getMessage().getChatId();

		try {
			processMessageByCommand(messageText, chatId, update);
		} catch (Exception e) {
			logger.error("Error processing message: {}", e.getLocalizedMessage(), e);
			messageSender.sendErrorMessage(chatId);
		}
	}

	private void processMessageByCommand(String messageText, long chatId, Update update) {
		if (commandHandler.isStartCommand(messageText)) {
			commandHandler.handleStartCommand(chatId, update);
		} else if (messageText.contains(BotLabels.DONE.getLabel())) {
			commandHandler.handleDoneCommand(messageText, chatId);
		} else if (messageText.contains(BotLabels.UNDO.getLabel())) {
			commandHandler.handleUndoCommand(messageText, chatId);
		} else if (messageText.contains(BotLabels.DELETE.getLabel())) {
			commandHandler.handleDeleteCommand(messageText, chatId);
		} else if (commandHandler.isHideCommand(messageText)) {
			commandHandler.handleHideCommand(chatId);
		} else if (commandHandler.isListCommand(messageText)) {
			commandHandler.handleListCommand(chatId);
		} else if (commandHandler.isAddItemCommand(messageText)) {
			commandHandler.handleAddItemCommand(chatId);
		} else {
			commandHandler.handleNewItemCreation(messageText, chatId);
		}
	}

	@Override
	public String getBotUsername() {
		return botName;
	}
}