package com.springboot.MyTodoList.telegram;

import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.BotCommands.KPICommands;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.telegram.telegrambots.meta.api.objects.CallbackQuery;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class TelegramTest {
    @Mock
    private CommandHandler commandHandler;
    
    @Mock
    private MessageSender messageSender;
    
    @Mock
    private InactivityManager inactivityManager;
    
    @Mock
    private ServiceManager serviceManager;
    
    @Mock
    private UserState userState;
    
    @Mock
    private KPICommands kpiCommands;
    
    private ToDoItemBotController bot;
    private final String dummyToken = "DUMMY";
    private final String dummyName = "DummyBot";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Configure the commandHandler mock to use our mocked kpiCommands
        when(commandHandler.getKpiCommands()).thenReturn(kpiCommands);
        
        bot = new ToDoItemBotController(
            dummyToken,
            dummyName,
            serviceManager,
            messageSender,
            inactivityManager,
            commandHandler
        );
    }

    @Test
    void testStartCommandTriggersStartHandler() {
        // Arrange
        long chatId = 123L;
        String text = "/start";

        Chat chat = mock(Chat.class);
        when(chat.getId()).thenReturn(chatId);

        Message message = mock(Message.class);
        when(message.getText()).thenReturn(text);
        when(message.hasText()).thenReturn(true);
        when(message.getChat()).thenReturn(chat);
        when(message.getChatId()).thenReturn(chatId);

        Update update = mock(Update.class);
        when(update.hasCallbackQuery()).thenReturn(false);
        when(update.hasMessage()).thenReturn(true);
        when(update.getMessage()).thenReturn(message);

        when(commandHandler.isStartCommand(text)).thenReturn(true);
        when(inactivityManager.getUserState(chatId)).thenReturn(userState);

        // Act
        bot.onUpdateReceived(update);

        // Assert
        verify(commandHandler).isStartCommand(text);
        verify(commandHandler).start(eq(chatId), eq(update));
    }

    @Test
    void testCallbackTriggersKpiShowSprintsCompletedTasks() {
        // Arrange
        long chatId = 123L;
        String callbackData = "ct_sprint_5_1"; // format: ct_sprint_{sprintId}_{projectId}

        CallbackQuery callbackQuery = mock(CallbackQuery.class);
        Message message = mock(Message.class);
        Update update = mock(Update.class);

        when(callbackQuery.getData()).thenReturn(callbackData);
        when(callbackQuery.getMessage()).thenReturn(message);
        when(message.getChatId()).thenReturn(chatId);
        when(update.hasCallbackQuery()).thenReturn(true);
        when(update.getCallbackQuery()).thenReturn(callbackQuery);
        when(inactivityManager.getUserState(chatId)).thenReturn(userState);

        // Act
        bot.onUpdateReceived(update);

        // Assert
        verify(commandHandler).handleCallback(eq(chatId), eq(callbackData), eq(update), eq(userState));
    }
    

    
    
}