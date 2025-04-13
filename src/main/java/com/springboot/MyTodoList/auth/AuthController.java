package com.springboot.MyTodoList.auth;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.repository.UserProjectRepository;
import com.springboot.MyTodoList.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserProjectRepository userProjectRepository;

    @PostMapping(value = "login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping(value = "register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping(value = "me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User currentUser = userService.findByEmail(email);

        if (currentUser != null) {
            List<UserProject> userProjects = userProjectRepository.findByUserId(currentUser.getId());
            Project userProject = null;
            String userRole = null;
            if (!userProjects.isEmpty()) {
                userProject = userProjects.get(0).getProject();
                userRole = userProjects.get(0).getRole();
            }

            UserResponse userResponse = UserResponse.builder()
                    .id(currentUser.getId())
                    .email(currentUser.getEmail())
                    .firstName(currentUser.getFirstName())
                    .lastName(currentUser.getLastName())
                    .telegramUsername(currentUser.getTelegramUsername())
                    .userLevel(currentUser.getUserLevel().getID())
                    .projectId(userProject != null ? userProject.getID() : null)
                    .projectName(userProject != null ? userProject.getName() : null)
                    .projectRole(userRole)
                    .build();

            return ResponseEntity.ok(userResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}