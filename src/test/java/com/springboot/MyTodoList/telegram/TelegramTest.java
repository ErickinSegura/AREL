package com.springboot.MyTodoList.telegram;
import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
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
    
    private ToDoItemBotController bot;
    private final String dummyToken = "DUMMY";
    private final String dummyName = "DummyBot";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        bot = new ToDoItemBotController(
            dummyToken,
            dummyName,
            serviceManager,
            messageSender,
            inactivityManager,
            commandHandler
        );
    }


    //#region Start Command
    @Test
    void testStartCommandTriggersStartHandler() {
        // Setup test data
        long chatId = 123L;
        String text = "/start";
        
        // Create mocks
        Chat chat = mock(Chat.class);
        when(chat.getId()).thenReturn(chatId);
        
        Message message = mock(Message.class);
        when(message.getText()).thenReturn(text);
        when(message.getChat()).thenReturn(chat);
        when(message.hasText()).thenReturn(true);
        when(message.getChatId()).thenReturn(chatId);
        
        Update update = mock(Update.class);
        when(update.hasCallbackQuery()).thenReturn(false);
        when(update.hasMessage()).thenReturn(true);
        when(update.getMessage()).thenReturn(message);
        
        // Configure
        when(commandHandler.isStartCommand(text)).thenReturn(true);
        when(inactivityManager.getUserState(chatId)).thenReturn(userState);

        // Execute
        bot.onUpdateReceived(update);
        
        // Verify
        verify(commandHandler).isStartCommand(text);
        verify(commandHandler).start(eq(chatId), eq(update));
    }
}