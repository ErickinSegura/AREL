package springboot.MyTodoList.controller;

import com.springboot.MyTodoList.controller.UserController;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.springboot.MyTodoList.model.UserLevel;
import java.util.Arrays;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    private UserService userService;
    private UserController userController;

    @BeforeEach
    public void setUp() {
        userService = mock(UserService.class);
        userController = new UserController();
        userController.getClass().getDeclaredFields();
        var field = UserController.class.getDeclaredFields()[0];
        field.setAccessible(true);
        try {
            field.set(userController, userService);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void testGetUsersByMultipleLevels() {
        UserLevel level1 = new UserLevel(); level1.setID(1);
        UserLevel level2 = new UserLevel(); level2.setID(2);
        User user1 = User.builder().id(1).email("a@a.com").userLevel(level1).build();
        User user2 = User.builder().id(2).email("b@b.com").userLevel(level2).build();

        when(userService.findAll()).thenReturn(Arrays.asList(user1, user2));

        ResponseEntity<List<User>> response = userController.getUsersByLevel(Arrays.asList(1, 2));
        assertEquals(2, response.getBody().size());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testGetAllUsers() {
        User user = new User();
        user.setEmail("test@example.com");

        when(userService.findAll()).thenReturn(List.of(user));

        List<User> users = userController.getAllUsers();

        assertEquals(1, users.size());
        assertEquals("test@example.com", users.get(0).getEmail());
    }

    @Test
    public void testGetUserById() {
        int userId = 1;
        User user = new User();
        user.setEmail("test@example.com");

        when(userService.getItemById(userId)).thenReturn(ResponseEntity.of(Optional.of(user)));

        ResponseEntity<User> response = userController.getUserByID(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("test@example.com", response.getBody().getEmail());
    }

    @Test
    public void testAddUser() throws Exception {
        User user = new User();
        user.setEmail("nuevo@ejemplo.com");

        when(userService.addUser(user)).thenReturn(user);

        ResponseEntity<User> response = userController.addUser(user);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testUpdateUser() {
        int userId = 1;
        User user = new User();
        user.setEmail("actualizado@example.com");

        when(userService.updateUser(userId, user)).thenReturn(user);

        ResponseEntity<User> response = userController.updateUser(user, userId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("actualizado@example.com", response.getBody().getEmail());
    }

    @Test
    public void testDeleteUser() {
        int userId = 1;

        when(userService.deleteUser(userId)).thenReturn(true);

        ResponseEntity<Boolean> response = userController.deleteUser(userId);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody());
    }
}