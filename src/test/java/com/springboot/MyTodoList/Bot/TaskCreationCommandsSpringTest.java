package com.springboot.MyTodoList.Bot;

import com.springboot.MyTodoList.service.ServiceManager;
import com.springboot.MyTodoList.telegram.BotCommands.TaskCreationCommands;
import com.springboot.MyTodoList.telegram.BotSessionManager.InactivityManager;
import com.springboot.MyTodoList.telegram.MessageSender;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class TaskCreationCommandsSpringTest {

    @Autowired
    private ApplicationContext context;

    @Test
    void testTaskCreationCommandsBeanFails() {
        // Intenta obtener TaskCreationCommands como bean de Spring
        // Esto debería fallar porque no está anotado como @Component y tiene dependencias no inyectadas correctamente
        Exception exception = assertThrows(Exception.class, () -> {
            context.getBean(TaskCreationCommands.class);
        });
        System.out.println("Error esperado: " + exception.getMessage());
    }

    @Test
    void testManualInstantiationWithNullDependencies() {
        // Intenta instanciar TaskCreationCommands con dependencias nulas
        Exception exception = assertThrows(NullPointerException.class, () -> {
            new TaskCreationCommands(null, null, null).handleCreateTask("create_task_project_1", 1L);
        });
        System.out.println("Error esperado por dependencias nulas: " + exception.getMessage());
    }

    @Test
    void testManualInstantiationWithMocksButNoSpringBeans() {
        // Instancia manualmente con mocks, pero KeyboardFactory no es inyectado por Spring
        ServiceManager mockService = org.mockito.Mockito.mock(ServiceManager.class);
        MessageSender mockSender = org.mockito.Mockito.mock(MessageSender.class);
        InactivityManager mockInactivity = org.mockito.Mockito.mock(InactivityManager.class);

        TaskCreationCommands commands = new TaskCreationCommands(mockService, mockSender, mockInactivity);

        // KeyboardFactory se crea manualmente, pero no es un bean de Spring
        assertNotNull(commands);

        // Prueba que la instancia no es un bean de Spring
        assertFalse(context.containsBean("taskCreationCommands"));
    }

    @Test
    void testKeyboardFactoryNotInjected() {
        // Instancia TaskCreationCommands y verifica que KeyboardFactory no es inyectado por Spring
        ServiceManager mockService = org.mockito.Mockito.mock(ServiceManager.class);
        MessageSender mockSender = org.mockito.Mockito.mock(MessageSender.class);
        InactivityManager mockInactivity = org.mockito.Mockito.mock(InactivityManager.class);

        TaskCreationCommands commands = new TaskCreationCommands(mockService, mockSender, mockInactivity);

        // KeyboardFactory es creado manualmente, no por Spring
        // No hay forma de obtenerlo como bean
        assertThrows(org.springframework.beans.factory.NoSuchBeanDefinitionException.class, () -> {
            context.getBean("keyboardFactory");
        });
    }
}
