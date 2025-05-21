package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.auth.*;
import com.springboot.MyTodoList.repository.UserProjectRepository;
import com.springboot.MyTodoList.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private UserService userService;

    @Mock
    private UserProjectRepository userProjectRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testLoginSuccess() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        AuthResponse expectedResponse = AuthResponse.builder()
                .token("jwt_token")
                .build();

        when(authService.login(loginRequest)).thenReturn(expectedResponse);

        // Act
        ResponseEntity<AuthResponse> response = authController.login(loginRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(authService).login(loginRequest);
    }

    @Test
    void testLoginFailure() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("invalid@example.com");
        loginRequest.setPassword("wrongpassword");
        when(authService.login(loginRequest)).thenThrow(new RuntimeException("Invalid credentials"));
        Exception exception = assertThrows(RuntimeException.class, () -> {
            authController.login(loginRequest);
        });
        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("new@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setTelegramUsername("johndoe");
        AuthResponse expectedResponse = AuthResponse.builder()
                .token("new_jwt_token")
                .build();
        when(authService.register(registerRequest)).thenReturn(expectedResponse);
        ResponseEntity<AuthResponse> response = authController.register(registerRequest);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(authService).register(registerRequest);
    }

    @Test
    void testRegisterDuplicateEmail() {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("existing@example.com");
        registerRequest.setPassword("password123");

        when(authService.register(registerRequest))
                .thenThrow(new IllegalArgumentException("Email already in use"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.register(registerRequest);
        });
        assertEquals("Email already in use", exception.getMessage());
    }

    /*@Test
    void testGetCurrentUserSuccess() {
        String email = "test@example.com";
        when(authentication.getName()).thenReturn(email);
        User mockUser = new User();
        mockUser.setId(1);
        mockUser.setEmail(email);
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        Project mockProject = new Project();
        mockProject.setID(1);
        mockProject.setName("Test Project");
        UserProject mockUserProject = new UserProject();
        mockUserProject.setUser(mockUser);
        mockUserProject.setProject(mockProject);
        mockUserProject.setRole("ADMIN");
        when(userService.findByEmail(email)).thenReturn(mockUser);
        when(userProjectRepository.findByUserId(1)).thenReturn(Arrays.asList(mockUserProject));
        ResponseEntity<?> response = authController.getCurrentUser();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof UserResponse);
        UserResponse userResponse = (UserResponse) response.getBody();
        assertEquals(email, userResponse.getEmail());
        assertEquals(1, userResponse.getProjectId());
        assertEquals("Test Project", userResponse.getProjectName());
        assertEquals("ADMIN", userResponse.getProjectRole());
    }*/

    @Test
    void testGetCurrentUserNotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        when(authentication.getName()).thenReturn(email);
        when(userService.findByEmail(email)).thenReturn(null);

        // Act
        ResponseEntity<?> response = authController.getCurrentUser();

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    /*@Test
    void testGetCurrentUserWithNoProjects() {
        String email = "test@example.com";
        when(authentication.getName()).thenReturn(email);
        User mockUser = new User();
        mockUser.setId(1);
        mockUser.setEmail(email);
        when(userService.findByEmail(email)).thenReturn(mockUser);
        when(userProjectRepository.findByUserId(1)).thenReturn(Collections.emptyList());
        ResponseEntity<?> response = authController.getCurrentUser();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        UserResponse userResponse = (UserResponse) response.getBody();
        assertNull(userResponse.getProjectId());
        assertNull(userResponse.getProjectName());
        assertNull(userResponse.getProjectRole());
    }*/

    @Test
    void testRegisterWithInvalidTelegramUsername() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("new@example.com");
        registerRequest.setTelegramUsername("existing_username");
        when(authService.register(registerRequest))
                .thenThrow(new IllegalArgumentException("Telegram username already in use"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.register(registerRequest);
        });
        assertEquals("Telegram username already in use", exception.getMessage());
    }

    @Test
    void testLoginWithEmptyCredentials() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("");
        loginRequest.setPassword("");
        when(authService.login(loginRequest))
            .thenThrow(new IllegalArgumentException("Email and password cannot be empty"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.login(loginRequest);
        });
        assertEquals("Email and password cannot be empty", exception.getMessage());
    }

    @Test
    void testRegisterWithInvalidEmail() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("invalid-email");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        when(authService.register(registerRequest))
            .thenThrow(new IllegalArgumentException("Invalid email format"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.register(registerRequest);
        });
        assertEquals("Invalid email format", exception.getMessage());
    }

    @Test
    void testRegisterWithWeakPassword() {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("weak");
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");

        when(authService.register(registerRequest))
            .thenThrow(new IllegalArgumentException("Password must be at least 8 characters long"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.register(registerRequest);
        });
        assertEquals("Password must be at least 8 characters long", exception.getMessage());
    }

    /*@Test
    void testGetCurrentUserWithMultipleProjects() {
        String email = "test@example.com";
        when(authentication.getName()).thenReturn(email);
        User mockUser = new User();
        mockUser.setId(1);
        mockUser.setEmail(email);
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        Project mockProject1 = new Project();
        mockProject1.setID(1);
        mockProject1.setName("Project 1");
        Project mockProject2 = new Project();
        mockProject2.setID(2);
        mockProject2.setName("Project 2");
        UserProject userProject1 = new UserProject();
        userProject1.setUser(mockUser);
        userProject1.setProject(mockProject1);
        userProject1.setRole("ADMIN");
        UserProject userProject2 = new UserProject();
        userProject2.setUser(mockUser);
        userProject2.setProject(mockProject2);
        userProject2.setRole("USER");
        when(userService.findByEmail(email)).thenReturn(mockUser);
        when(userProjectRepository.findByUserId(1))
            .thenReturn(Arrays.asList(userProject1, userProject2));
        ResponseEntity<?> response = authController.getCurrentUser();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        UserResponse userResponse = (UserResponse) response.getBody();
        assertEquals(email, userResponse.getEmail());
        assertEquals(1, userResponse.getProjectId());
        assertEquals("Project 1", userResponse.getProjectName());
        assertEquals("ADMIN", userResponse.getProjectRole());
    }*/

    /*@Test
    void testGetCurrentUserWithMissingAuthentication() {
        when(securityContext.getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);
        ResponseEntity<?> response = authController.getCurrentUser();
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }*/

    @Test
    void testRegisterWithMissingRequiredFields() {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        // Missing other required fields

        when(authService.register(registerRequest))
            .thenThrow(new IllegalArgumentException("All required fields must be provided"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.register(registerRequest);
        });
        assertEquals("All required fields must be provided", exception.getMessage());
    }

    @Test
    void testLoginWithInvalidEmailFormat() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("invalid-email-format");
        loginRequest.setPassword("password123");

        when(authService.login(loginRequest))
            .thenThrow(new IllegalArgumentException("Invalid email format"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.login(loginRequest);
        });
        assertEquals("Invalid email format", exception.getMessage());
    }

    @Test
    void testLoginWithExcessiveLength() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        // Create a password that exceeds maximum length
        String longPassword = String.join("", Collections.nCopies(1000, "a"));
        loginRequest.setPassword(longPassword);

        when(authService.login(loginRequest))
            .thenThrow(new IllegalArgumentException("Password exceeds maximum length"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.login(loginRequest);
        });
        assertEquals("Password exceeds maximum length", exception.getMessage());
    }

    @Test
    void testRegisterWithSpecialCharactersInName() {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("John@#$%");
        registerRequest.setLastName("Doe!@#");
        registerRequest.setTelegramUsername("johndoe");

        when(authService.register(registerRequest))
            .thenThrow(new IllegalArgumentException("Names can only contain letters"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.register(registerRequest);
        });
        assertEquals("Names can only contain letters", exception.getMessage());
    }

    /*@Test
    void testGetCurrentUserWithExpiredToken() {
        when(authentication.getName()).thenThrow(new RuntimeException("Token has expired"));
        ResponseEntity<?> response = authController.getCurrentUser();
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }*/

    @Test
    void testLoginWithSQLInjectionAttempt() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("' OR '1'='1");
        loginRequest.setPassword("' OR '1'='1");

        when(authService.login(loginRequest))
            .thenThrow(new IllegalArgumentException("Invalid email format"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.login(loginRequest);
        });
        assertEquals("Invalid email format", exception.getMessage());
    }

    @Test
    void testRegisterWithPasswordContainingEmailPart() {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("john@example.com");
        registerRequest.setPassword("john123456"); // Password contains username part
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");

        when(authService.register(registerRequest))
            .thenThrow(new IllegalArgumentException("Password cannot contain parts of email address"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authController.register(registerRequest);
        });
        assertEquals("Password cannot contain parts of email address", exception.getMessage());
    }

    /*@Test
    void testGetCurrentUserWithNullEmail() {
        when(authentication.getName()).thenReturn(null);
        ResponseEntity<?> response = authController.getCurrentUser();
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }*/

    @Test
    void testRegisterWithUnicodeCharacters() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("José");
        registerRequest.setLastName("García");
        registerRequest.setTelegramUsername("josegarcia");
        AuthResponse expectedResponse = AuthResponse.builder()
                .token("new_jwt_token")
                .build();
        when(authService.register(registerRequest)).thenReturn(expectedResponse);
        ResponseEntity<AuthResponse> response = authController.register(registerRequest);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

    /*@Test
    void testGetCurrentUserWithMalformedProjectData() {
        String email = "test@example.com";
        when(authentication.getName()).thenReturn(email);
        User mockUser = new User();
        mockUser.setId(1);
        mockUser.setEmail(email);
        UserProject malformedUserProject = new UserProject();
        malformedUserProject.setUser(mockUser);
        malformedUserProject.setProject(null); // Malformed project data
        malformedUserProject.setRole("ADMIN");
        when(userService.findByEmail(email)).thenReturn(mockUser);
        when(userProjectRepository.findByUserId(1)).thenReturn(Arrays.asList(malformedUserProject));
        ResponseEntity<?> response = authController.getCurrentUser();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        UserResponse userResponse = (UserResponse) response.getBody();
        assertNull(userResponse.getProjectId());
        assertNull(userResponse.getProjectName());
        assertEquals("ADMIN", userResponse.getProjectRole());
    }*/
}

