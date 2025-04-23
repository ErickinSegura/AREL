package springboot.MyTodoList.controller;

import com.springboot.MyTodoList.controller.UserController;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserLevel;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.service.UserProjectService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
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
}
