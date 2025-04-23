package com.springboot.MyTodoList.telegram;

import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class CommandHandlerTest {

    @Mock
    private MessageSender messageSender;

    @Mock
    private ServiceManager serviceManager;

    @Mock
    private InactivityManager inactivityManager;

    @InjectMocks
    private CommandHandler commandHandler;

    private Update mockUpdate;
    private Message mockMessage;
    private long chatId = 123456L;

    @BeforeEach
    void setup() {
        mockUpdate = new Update();
        mockMessage = mock(Message.class);
        when(mockMessage.hasText()).thenReturn(true);
        when(mockMessage.getText()).thenReturn("/nuevaTarea Implementar login");
        when(mockMessage.getChatId()).thenReturn(chatId);
        mockUpdate.setMessage(mockMessage);
    }

    @Test
    void testCrearTareaEnvíaMensaje() {
        UserState state = new UserState();
        state.setState(UserStateType.IDLE);

        commandHandler.handleTextInput(state, "/nuevaTarea Implementar login", chatId, mockUpdate);

        verify(messageSender).sendMessage(eq(chatId), contains("Tarea"));
    }
}