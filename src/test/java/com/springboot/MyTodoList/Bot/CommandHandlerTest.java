package com.springboot.MyTodoList.Bot;

import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserState;
import com.springboot.MyTodoList.telegram.BotSessionManager.UserStateType;
import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.MessageSender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

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
        mockUpdate.setMessage(mockMessage);
    }

    @Test
    void testCrearTareaEnvíaMensaje() {
        UserState state = new UserState();
        state.setState(UserStateType.CREATE_TASK_ENTER_NAME);

        commandHandler.handleTextInput(state, "Implementar login", chatId, new Update());

        ArgumentCaptor<SendMessage> captor = ArgumentCaptor.forClass(SendMessage.class);
        verify(messageSender).sendMessage(captor.capture());

        SendMessage sent = captor.getValue();
        System.out.println("Texto del bot: " + sent.getText());

        assertEquals("Now, enter the description for this ticket:", sent.getText());
    }
}