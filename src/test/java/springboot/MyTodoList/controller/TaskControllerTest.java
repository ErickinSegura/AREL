package springboot.MyTodoList.controller;

import com.springboot.MyTodoList.controller.TaskController;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class TaskControllerTest {

    private TaskService taskService;
    private TaskController taskController;

    @BeforeEach
    void setUp() {
        taskService = mock(TaskService.class);
        taskController = new TaskController();
        try {
            java.lang.reflect.Field field = TaskController.class.getDeclaredField("taskService");
            field.setAccessible(true);
            field.set(taskController, taskService);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetAllToDoItems() {
        Task task1 = new Task();
        Task task2 = new Task();
        List<Task> tasks = Arrays.asList(task1, task2);

        when(taskService.findAll()).thenReturn(tasks);

        List<Task> result = taskController.getAllToDoItems();

        assertEquals(2, result.size());
        verify(taskService, times(1)).findAll();
    }

    @Test
    void testGetToDoItemByIdFound() {
        Task task = new Task();
        task.setID(1);

        when(taskService.getTaskById(1)).thenReturn(new ResponseEntity<>(task, HttpStatus.OK));

        ResponseEntity<Task> response = taskController.getToDoItemById(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(task, response.getBody());
    }

    @Test
    void testGetToDoItemByIdNotFound() {
        when(taskService.getTaskById(1)).thenThrow(new RuntimeException());

        ResponseEntity<Task> response = taskController.getToDoItemById(1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testAddToDoItem() throws Exception {
        Task task = new Task();
        task.setID(99);

        when(taskService.addTask(task)).thenReturn(task);

        ResponseEntity<?> response = taskController.addToDoItem(task);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("99", response.getHeaders().get("location").get(0));
    }

    /*@Test
    void testUpdateToDoItem() {
        Task task = new Task();
        task.setID(1);

        when(taskService.updateTask(1, task)).thenReturn(task);

        ResponseEntity<?> response = taskController.updateToDoItem(task, 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(task, response.getBody());
    }*/

    @Test
    void testDeleteToDoItemSuccess() {
        when(taskService.deleteTask(1)).thenReturn(true);

        ResponseEntity<Boolean> response = taskController.deleteToDoItem(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody());
    }

    @Test
    void testDeleteToDoItemFailure() {
        when(taskService.deleteTask(2)).thenThrow(new RuntimeException());

        ResponseEntity<Boolean> response = taskController.deleteToDoItem(2);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(false, response.getBody());
    }
}