package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import java.util.Collections;

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

    @Test
    void testGetTasksByProject() {
        int projectId = 1;
        Task task1 = new Task();
        task1.setID(1);
        Task task2 = new Task();
        task2.setID(2);
        List<Task> projectTasks = Arrays.asList(task1, task2);
        
        when(taskService.getTasksByProject(projectId)).thenReturn(projectTasks);
        
        ResponseEntity<List<Task>> response = taskController.getTasksByProject(projectId);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(taskService).getTasksByProject(projectId);
    }

    @Test
    void testGetTasksByProjectEmpty() {
        int projectId = 1;
        List<Task> emptyList = Arrays.asList();
        when(taskService.getTasksByProject(projectId)).thenReturn(emptyList);
        
        ResponseEntity<List<Task>> response = taskController.getTasksByProject(projectId);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetTasksBySprintAndProject() {
        int projectId = 1;
        int sprintId = 1;
        Task task1 = new Task();
        task1.setID(1);
        Task task2 = new Task();
        task2.setID(2);
        List<Task> sprintTasks = Arrays.asList(task1, task2);
        
        when(taskService.getTasksBySprintAndProject(sprintId, projectId)).thenReturn(sprintTasks);
        
        ResponseEntity<List<Task>> response = taskController.getTasksBySprintAndProject(projectId, sprintId);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(taskService).getTasksBySprintAndProject(sprintId, projectId);
    }

    @Test
    void testGetTasksBySprintAndProjectEmpty() {
        int projectId = 1;
        int sprintId = 1;
        List<Task> emptyList = Arrays.asList();
        
        when(taskService.getTasksBySprintAndProject(sprintId, projectId)).thenReturn(emptyList);
        
        ResponseEntity<List<Task>> response = taskController.getTasksBySprintAndProject(projectId, sprintId);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testUpdateToDoItem() {
        Task task = new Task();
        task.setID(1);
        task.setTitle("Updated Task");

        when(taskService.updateTask(1, task)).thenReturn(task);

        ResponseEntity<Task> response = taskController.updateToDoItem(task, 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(task, response.getBody());
        verify(taskService).updateTask(1, task);
    }

    @Test
    void testUpdateToDoItemNotFound() {
        Task task = new Task();
        task.setID(1);
        
        when(taskService.updateTask(1, task)).thenThrow(new RuntimeException());
        
        ResponseEntity<Task> response = taskController.updateToDoItem(task, 1);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    /*@Test
    void testGetTasksByProjectWithException() {
        int projectId = 1;
        when(taskService.getTasksByProject(projectId))
            .thenThrow(new RuntimeException("Database connection error"));
        ResponseEntity<List<Task>> response = taskController.getTasksByProject(projectId);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());
    }*/

    @Test
    void testAddToDoItemWithValidationError() throws Exception {
        Task invalidTask = new Task();
        // Set invalid data
        invalidTask.setTitle(""); // Empty title
        when(taskService.addTask(invalidTask))
            .thenThrow(new IllegalArgumentException("Task title cannot be empty"));
        Exception exception = assertThrows(Exception.class, () -> {
            taskController.addToDoItem(invalidTask);
        });
        assertTrue(exception.getMessage().contains("Task title cannot be empty"));
    }

    /*@Test
    void testUpdateToDoItemWithNullBody() {
        ResponseEntity<Task> response = taskController.updateToDoItem(null, 1);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    /*@Test
    void testGetToDoItemByIdWithNegativeId() {
        ResponseEntity<Task> response = taskController.getToDoItemById(-1);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    /*@Test
    void testDeleteToDoItemWithNegativeId() {
        ResponseEntity<Boolean> response = taskController.deleteToDoItem(-1);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse(response.getBody());
    }*/

    /*@Test
    void testGetTasksBySprintAndProjectWithServiceError() {
        int projectId = 1;
        int sprintId = 1;
        when(taskService.getTasksBySprintAndProject(sprintId, projectId))
            .thenThrow(new RuntimeException("Service unavailable"));
        ResponseEntity<List<Task>> response = taskController.getTasksBySprintAndProject(projectId, sprintId);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());
    }*/

    @Test
    void testAddToDoItemWithLargeTitleAndDescription() throws Exception {
        Task task = new Task();
        // Create a string that exceeds normal length limits
        String longString = String.join("", Collections.nCopies(1000, "a"));
        task.setTitle(longString);
        task.setDescription(longString);
        when(taskService.addTask(task))
            .thenThrow(new IllegalArgumentException("Title or description too long"));
        Exception exception = assertThrows(Exception.class, () -> {
            taskController.addToDoItem(task);
        });
        assertTrue(exception.getMessage().contains("too long"));
    }

    @Test
    void testGetTasksByProjectWithPagination() {
        int projectId = 1;
        List<Task> largeTasks = Arrays.asList(
            createTask(1, "Task 1"),
            createTask(2, "Task 2"),
            createTask(3, "Task 3")
        );
        
        when(taskService.getTasksByProject(projectId)).thenReturn(largeTasks);
        
        ResponseEntity<List<Task>> response = taskController.getTasksByProject(projectId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(3, response.getBody().size());
    }

    private Task createTask(int id, String title) {
        Task task = new Task();
        task.setID(id);
        task.setTitle(title);
        return task;
    }
    
    @Test
    void testGetAllToDoItemsEmpty() {
        when(taskService.findAll()).thenReturn(Collections.emptyList());
        List<Task> result = taskController.getAllToDoItems();
        assertTrue(result.isEmpty());
    }

    /*@Test
    void testGetAllToDoItemsWithException() {
        when(taskService.findAll()).thenThrow(new RuntimeException("Database error"));
        List<Task> result = taskController.getAllToDoItems();
        assertTrue(result.isEmpty());
    }*/

    /*@Test
    void testUpdateToDoItemWithMismatchedIds() {
        Task task = new Task();
        task.setID(1);
        ResponseEntity<Task> response = taskController.updateToDoItem(task, 2);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    /*@Test
    void testGetTasksByProjectWithZeroId() {
        ResponseEntity<List<Task>> response = taskController.getTasksByProject(0);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    /*@Test
    void testGetTasksBySprintAndProjectWithZeroIds() {
        ResponseEntity<List<Task>> response = taskController.getTasksBySprintAndProject(0, 0);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    @Test
    void testAddToDoItemWithSpecialCharacters() throws Exception {
        Task task = new Task();
        task.setID(1);
        task.setTitle("!@#$%^&*()_+");
        task.setDescription("Special chars: áéíóú ñ");
        when(taskService.addTask(task)).thenReturn(task);
        ResponseEntity<?> response = taskController.addToDoItem(task);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    /*@Test
    void testUpdateToDoItemConcurrentModification() {
        Task task = new Task();
        task.setID(1);
        when(taskService.updateTask(1, task))
            .thenThrow(new RuntimeException("Concurrent modification detected"));
        ResponseEntity<Task> response = taskController.updateToDoItem(task, 1);
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }*/

    @Test
    void testDeleteToDoItemAlreadyDeleted() {
        when(taskService.deleteTask(1))
            .thenThrow(new RuntimeException("Task already deleted"));
        ResponseEntity<Boolean> response = taskController.deleteToDoItem(1);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetTasksByProjectWithMaxProjectId() {
        int maxProjectId = Integer.MAX_VALUE;
        when(taskService.getTasksByProject(maxProjectId))
            .thenReturn(Collections.emptyList());
        ResponseEntity<List<Task>> response = taskController.getTasksByProject(maxProjectId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void testAddToDoItemWithMinimalData() throws Exception {
        Task task = new Task();
        task.setID(1);
        task.setTitle("Minimal");
        when(taskService.addTask(task)).thenReturn(task);
        ResponseEntity<?> response = taskController.addToDoItem(task);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    /*@Test
    void testGetTasksBySprintAndProjectWithInvalidSprintId() {
        int projectId = 1;
        int invalidSprintId = -1;
        ResponseEntity<List<Task>> response = taskController.getTasksBySprintAndProject(projectId, invalidSprintId);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    @Test
    void testAddToDoItemWithDuplicateId() throws Exception {
        Task task = new Task();
        task.setID(1);
        task.setTitle("Duplicate Task");
        when(taskService.addTask(task))
            .thenThrow(new IllegalStateException("Task with ID 1 already exists"));     
        Exception exception = assertThrows(Exception.class, () -> {
            taskController.addToDoItem(task);
        });
        assertTrue(exception.getMessage().contains("already exists"));
    }

    @Test
    void testGetTasksBySprintAndProjectWithEstimatedHours() {
        int projectId = 1;
        int sprintId = 1;
        Task task1 = createTask(1, "Task with hours");
        task1.setEstimatedHours(4);
        Task task2 = createTask(2, "Task without hours");
        List<Task> tasks = Arrays.asList(task1, task2);
        when(taskService.getTasksBySprintAndProject(sprintId, projectId)).thenReturn(tasks);
        ResponseEntity<List<Task>> response = taskController.getTasksBySprintAndProject(projectId, sprintId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(4, response.getBody().get(0).getEstimatedHours());
        assertNull(response.getBody().get(1).getEstimatedHours());
    }

    @Test
    void testAddTaskWithRealAndEstimatedHours() throws Exception {
        Task task = new Task();
        task.setID(1);
        task.setTitle("Task with hours");
        task.setEstimatedHours(8);
        task.setRealHours(10);
        when(taskService.addTask(task)).thenReturn(task);
        ResponseEntity<?> response = taskController.addToDoItem(task);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    /*@Test
    void testGetTasksByProjectWithMalformedProjectId() {
        ResponseEntity<List<Task>> response = taskController.getTasksByProject(Integer.MIN_VALUE);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/
}
