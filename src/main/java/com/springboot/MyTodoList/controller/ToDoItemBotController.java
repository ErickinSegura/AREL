package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.service.ServiceManager;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.api.objects.Update;

import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.MessageSender;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;

public class ToDoItemBotController extends TelegramLongPollingBot {

	private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
	private final String botName;
	private final CommandHandler commandHandler;
	private final MessageSender messageSender;
	private final ServiceManager serviceManager;
	private final InactivityManager inactivityManager;

	public ToDoItemBotController(String botToken, String botName, ServiceManager serviceManager) {
		super(botToken);
		logger.info("Bot Token: {}", botToken);
		logger.info("Bot name: {}", botName);
		this.botName = botName;
		this.serviceManager = serviceManager;
		this.messageSender = new MessageSender(this);
		this.inactivityManager = new InactivityManager(messageSender);
	    this.commandHandler = new CommandHandler(this.messageSender,this.serviceManager, this.inactivityManager);
	}

	public ToDoItemBotController(String botToken, String botName,
							ServiceManager serviceManager,
							MessageSender messageSender,
							InactivityManager inactivityManager,
							CommandHandler commandHandler) {
		super(botToken);
		this.botName = botName;
		this.serviceManager = serviceManager;
		this.messageSender = messageSender;
		this.inactivityManager = inactivityManager;
		this.commandHandler = commandHandler;
	}

	@Override
	public void onUpdateReceived(Update update) {
		logger.debug("got an update!!");
		if (!update.hasCallbackQuery()) {
			logger.debug("not a callback");
			if (update.hasMessage()) {
				logger.debug("it is a message");
				if (update.getMessage().hasText()) {
					//Text Message Present
					logger.debug("has text, yeahh!!");
					long chatId = update.getMessage().getChatId();
					String messageText = update.getMessage().getText();
					try {
						inactivityManager.receivedMessageFrom(chatId);
						processMessageByCommand(messageText, chatId, update);
						UserStateType state = inactivityManager.getUserState(chatId).getState();
						logger.debug("USER_STATE_LOG: "+state.toString());
					} catch (Exception e) {
						logger.error("Error in message: {}", e.getLocalizedMessage(), e);
						messageSender.sendErrorMessage(chatId);
					}
				} else if (update.getMessage().hasVoice()){
					logger.debug("Voice Message Detected!!");
					String fileId = update.getMessage().getVoice().getFileId();
					commandHandler.transcript(update.getMessage().getChatId(), fileId);
					return;
				} else {
					
					logger.debug("message has no text, doing nothing....");
					return;
				}
			}
			else {
				logger.debug("Nothing detected, doing nothing...");
				return;
			}
		} else {
			//Callback present
			long chatId = update.getCallbackQuery().getMessage().getChatId();
			inactivityManager.receivedMessageFrom(chatId);

			String callbackQuery = update.getCallbackQuery().getData();
			UserState state = inactivityManager.getUserState(chatId);
			
			commandHandler.handleCallback(chatId, callbackQuery, update, state);
			inactivityManager.receivedMessageFrom(chatId);
		}
	}

	private void processMessageByCommand(String messageText, long chatId, Update update) {
		if (commandHandler.isStartCommand(messageText)) { // Start Command
			commandHandler.start(chatId, update);
		}
		else { // User entered only text
			UserState state = inactivityManager.getUserState(chatId);
			commandHandler.handleTextInput(state, messageText, chatId, update);
		}
	}

	@Override
	public String getBotUsername() {
		return botName;
	}
}