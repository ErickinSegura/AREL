package com.springboot.MyTodoList.Bot;

import com.springboot.MyTodoList.service.*;
import com.springboot.MyTodoList.telegram.BotCommands.*;
import com.springboot.MyTodoList.telegram.BotSessionManager.*;
import com.springboot.MyTodoList.telegram.CommandHandler;
import com.springboot.MyTodoList.telegram.MessageSender;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class CommandHandlerTest {

    @Mock private MessageSender messageSender;
    @Mock private ServiceManager serviceManager;
    @Mock private TaskCreationCommands taskCreationCommands;
    @Mock private AgileCommands agileCommands;
    @Mock private TaskService taskService;
    @Mock private AICommands aiCommands;
    @Mock private InactivityManager inactivityManager;
    @Mock private AIService aiService;
    @Mock private UserProjectService userProjectService;
    @Mock private TaskManagementCommands taskManagementCommands;
    @Mock private KPICommands kpiCommands;
    @Mock private OverviewService overviewService;

    private CommandHandler commandHandler;

    private Update mockUpdate;
    private Message mockMessage;
    private final long chatId = 123456L;
    private UserState userState;

    @Captor private ArgumentCaptor<SendMessage> messageCaptor;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        mockUpdate = mock(Update.class);
        mockMessage = mock(Message.class);

        userState = new UserState();
        userState.setState(UserStateType.START);
        userState.setSelectedProject(123);

        // Inicializa CommandHandler con los mocks
        commandHandler = new CommandHandler(
            serviceManager,
            messageSender,
            inactivityManager,
            taskCreationCommands,
            agileCommands,
            taskManagementCommands,
            kpiCommands,
            aiCommands
        );
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

    @Test
    @DisplayName("/ai command should trigger AI prompt")
    void testAICommand() {
        commandHandler.handleTextInput(userState, "/ai suggest something", chatId, mockUpdate);
        verify(aiCommands).sendPrompt(eq(chatId), eq("/ai suggest something"));
    }

    @Test
    @DisplayName("Create Task command should invoke TaskCreationCommands")
    void testCreateTaskCommand() {
        commandHandler.handleTextInput(userState, "Create Task", chatId, mockUpdate);
        verify(taskCreationCommands).handleCreateTask(eq("create_task_project_123"), eq(chatId));
    }

    @Test
    @DisplayName("See Backlog command should invoke AgileCommands")
    void testSeeBacklogCommand() {
        commandHandler.handleTextInput(userState, "See Backlog", chatId, mockUpdate);
        verify(agileCommands).openBacklog(eq(chatId), eq(123));
    }

    @Test
    @DisplayName("KPI Overview command should invoke KPI menu")
    void testKPIOverviewCommand() {
        commandHandler.handleTextInput(userState, "KPI Overview", chatId, mockUpdate);
        verify(kpiCommands).openKPIMenu(eq(chatId), eq(123));
    }

    @Test
    @DisplayName("Sprints command should invoke sprint list")
    void testSprintsCommand() {
        commandHandler.handleTextInput(userState, "Sprints", chatId, mockUpdate);
        verify(agileCommands).sprintList(eq(chatId), eq(123));
    }

    @Test
    @DisplayName("See developers' tasks command should invoke task monitoring")
    void testSeeDevelopersTasksCommand() {
        commandHandler.handleTextInput(userState, "See developers' tasks", chatId, mockUpdate);
        verify(taskManagementCommands).selectUserForTaskMonitoring(eq(chatId), eq(123));
    }

    @Test
    @DisplayName("Create Task flow sets title and goes to description")
    void testCreateTaskSetTitle() {
        userState.setState(UserStateType.CREATE_TASK_ENTER_NAME);
        commandHandler.handleTextInput(userState, "Fix bug", chatId, mockUpdate);
        verify(taskCreationCommands).handleSetTitle(eq(userState), eq("Fix bug"));
    }

    @Test
    @DisplayName("State with no project triggers fallback")
    void testNoProjectSelectedTriggersFallback() {
        userState.setSelectedProject(null);
        commandHandler.handleTextInput(userState, "Create Task", chatId, mockUpdate);
        verify(agileCommands).noProjectSelectedManager(eq(chatId), eq(mockUpdate));
    }

    @Test
    @DisplayName("Unknown command returns default message")
    void testUnknownCommandReturnsDefaultMessage() {
        commandHandler.handleTextInput(userState, "Unknown command", chatId, mockUpdate);
        verify(messageSender).sendMessage(any(SendMessage.class));
    }
}
