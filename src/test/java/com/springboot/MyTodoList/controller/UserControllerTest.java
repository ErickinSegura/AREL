package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserLevel;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.service.UserProjectService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    private UserService userService;
    private UserProjectService userProjectService;
    private UserController userController;

    @BeforeEach
    public void setUp() {
        userService = mock(UserService.class);
        userProjectService = mock(UserProjectService.class);
        userController = new UserController();

        // Inyectamos manualmente los servicios con reflexión
        Arrays.stream(UserController.class.getDeclaredFields()).forEach(field -> {
            try {
                field.setAccessible(true);
                if (field.getType().equals(UserService.class)) {
                    field.set(userController, userService);
                } else if (field.getType().equals(UserProjectService.class)) {
                    field.set(userController, userProjectService);
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Test
    public void testGetUsersByLevel() {
        UserLevel level1 = new UserLevel(); level1.setID(1);
        UserLevel level2 = new UserLevel(); level2.setID(2);
        User user1 = User.builder().id(1).email("a@a.com").userLevel(level1).build();
        User user2 = User.builder().id(2).email("b@b.com").userLevel(level2).build();

        when(userService.findAll()).thenReturn(Arrays.asList(user1, user2));

        ResponseEntity<List<User>> response = userController.getUsersByLevel(Arrays.asList(1, 2));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    public void testGetUserById() {
        int userId = 1;
        User user = new User();
        user.setEmail("test@example.com");

        when(userService.getItemById(userId)).thenReturn(ResponseEntity.of(Optional.of(user)));

        ResponseEntity<User> response = userController.getUserByID(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("test@example.com", response.getBody().getEmail());
    }

    @Test
    public void testUpdateUser() {
        int userId = 1;
        User user = new User();
        user.setEmail("actualizado@example.com");

        when(userService.updateUser(userId, user)).thenReturn(user);

        ResponseEntity<User> response = userController.updateUser(user, userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("actualizado@example.com", response.getBody().getEmail());
    }

    @Test
    public void testDeleteUser() {
        int userId = 1;

        when(userService.deleteUser(userId)).thenReturn(true);

        ResponseEntity<Boolean> response = userController.deleteUser(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
    }
    
    @Test
    public void testGetUsersByProject() {
        int projectId = 1;
        User user1 = User.builder()
                .id(1)
                .email("user1@test.com")
                .firstName("User")
                .lastName("One")
                .build();
        User user2 = User.builder()
                .id(2)
                .email("user2@test.com")
                .firstName("User")
                .lastName("Two")
                .build();
        
        UserProject userProject1 = new UserProject();
        userProject1.setUser(user1);
        UserProject userProject2 = new UserProject();
        userProject2.setUser(user2);
        
        List<UserProject> userProjects = Arrays.asList(userProject1, userProject2);
        
        when(userProjectService.getUsersByProject(projectId)).thenReturn(userProjects);
        
        ResponseEntity<List<User>> response = userController.getUsersByProject(projectId);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertEquals("user1@test.com", response.getBody().get(0).getEmail());
        assertEquals("user2@test.com", response.getBody().get(1).getEmail());
    }

    @Test
    public void testGetUsersByProjectEmpty() {
        int projectId = 1;
        when(userProjectService.getUsersByProject(projectId)).thenReturn(Arrays.asList());
        
        ResponseEntity<List<User>> response = userController.getUsersByProject(projectId);
        
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    public void testUpdateUserAvatar() {
        int userId = 1;
        String newAvatar = "new-avatar-url";
        User updatedUser = User.builder()
                .id(userId)
                .email("test@example.com")
                .avatar(newAvatar)
                .build();
        
        UserController.AvatarRequest avatarRequest = new UserController.AvatarRequest();
        // Set avatar using reflection since it's private
        try {
            java.lang.reflect.Field avatarField = UserController.AvatarRequest.class.getDeclaredField("avatar");
            avatarField.setAccessible(true);
            avatarField.set(avatarRequest, newAvatar);
        } catch (Exception e) {
            fail("Failed to set avatar field");
        }
        
        when(userService.updateUserAvatar(userId, newAvatar)).thenReturn(updatedUser);
        
        ResponseEntity<User> response = userController.updateUserAvatar(userId, avatarRequest);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(newAvatar, response.getBody().getAvatar());
    }

    @Test
    public void testUpdateUserAvatarNotFound() {
        int userId = 999;
        UserController.AvatarRequest avatarRequest = new UserController.AvatarRequest();
        try {
            java.lang.reflect.Field avatarField = UserController.AvatarRequest.class.getDeclaredField("avatar");
            avatarField.setAccessible(true);
            avatarField.set(avatarRequest, "new-avatar-url");
        } catch (Exception e) {
            fail("Failed to set avatar field");
        }
        
        when(userService.updateUserAvatar(userId, "new-avatar-url")).thenReturn(null);
        
        ResponseEntity<User> response = userController.updateUserAvatar(userId, avatarRequest);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetUsersByLevelWithInvalidLevel() {
        when(userService.findAll()).thenReturn(Arrays.asList());
        
        ResponseEntity<List<User>> response = userController.getUsersByLevel(Arrays.asList(999));
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    public void testUpdateUserNotFound() {
        int userId = 999;
        User user = new User();
        user.setEmail("notfound@example.com");
        
        when(userService.updateUser(userId, user)).thenThrow(new RuntimeException("User not found"));
        
        ResponseEntity<User> response = userController.updateUser(user, userId);
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetUserByIdReturnsNotFoundWhenUserDoesNotExist() {
        int userId = 999;
        when(userService.getItemById(userId)).thenReturn(ResponseEntity.of(Optional.empty()));

        ResponseEntity<User> response = userController.getUserByID(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }
}
