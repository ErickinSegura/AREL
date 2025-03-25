package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.service.ServiceManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.objects.Update;

import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.util.BotLabels;

public class ToDoItemBotController extends TelegramLongPollingBot {

	private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
	private final String botName;
	private final CommandHandler commandHandler;
	private final MessageSender messageSender;
	private final ServiceManager serviceManager;

	public ToDoItemBotController(String botToken, String botName, ServiceManager serviceManager) {
		super(botToken);
		logger.info("Bot Token: {}", botToken);
		logger.info("Bot name: {}", botName);
		this.botName = botName;
		this.serviceManager = serviceManager;
		this.messageSender = new MessageSender(this);
		this.commandHandler = new CommandHandler(this.messageSender, this.serviceManager);
	}

	@Override
	public void onUpdateReceived(Update update) {
		logger.debug("got an update!!");
		if (!update.hasCallbackQuery()) {
			logger.debug("not a callback");
			if (update.hasMessage()) {
				logger.debug("it is a message");
				if (update.getMessage().hasText()) {
					logger.debug("has text, yeahh!!");
					long chatId = update.getMessage().getChatId();
					String messageText = update.getMessage().getText();
					try {
						processMessageByCommand(messageText, chatId, update);
					} catch (Exception e) {
						logger.error("Error processing message: {}", e.getLocalizedMessage(), e);
						messageSender.sendErrorMessage(chatId);
					}
				}
				else{
					logger.debug("message has no text, doing nothing....");
					return;
				}
			}
			else {
				logger.debug("update has no message, doing nothing....");
				return;
			}
		} else {
			//Callback present
			String callbackQuery = update.getCallbackQuery().getData();
			long chatId = update.getCallbackQuery().getMessage().getChatId();
			commandHandler.handleCallback(chatId, callbackQuery, update);
		}
	}

	private void processMessageByCommand(String messageText, long chatId, Update update) {
		
		//Text message
		if (commandHandler.isStartCommand(messageText)) {
			commandHandler.handleStartCommand(chatId, update);
		} //else if (messageText.contains(BotLabels.DONE.getLabel())) {
		// 	commandHandler.handleDoneCommand(messageText, chatId);
		// } else if (messageText.contains(BotLabels.UNDO.getLabel())) {
		// 	commandHandler.handleUndoCommand(messageText, chatId);
		// } else if (messageText.contains(BotLabels.DELETE.getLabel())) {
		// 	commandHandler.handleDeleteCommand(messageText, chatId);
		// } else if (commandHandler.isHideCommand(messageText)) {
		// 	commandHandler.handleHideCommand(chatId);
		// } else if (commandHandler.isListCommand(messageText)) {
		// 	commandHandler.handleListCommand(chatId);
		// } else if (commandHandler.isAddItemCommand(messageText)) {
		// 	commandHandler.handleAddItemCommand(chatId);
		// } else {
		// 	commandHandler.handleNewItemCreation(messageText, chatId);
		// }

	}

	@Override
	public String getBotUsername() {
		return botName;
	}
}