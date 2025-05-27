package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.UserProjectDTO;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.service.UserProjectService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class UserProjectController {

    @Autowired
    private UserProjectService userProjectService;

    // CREATE - Asignar usuario a proyecto
    @PostMapping("/userproject")
    public ResponseEntity<?> assignUserToProject(@RequestBody AssignUserRequest request) {
        try {
            UserProject userProject = userProjectService.assignUserToProject(
                    request.getUserId(),
                    request.getProjectId(),
                    request.getRole()
            );

            UserProjectDTO dto = convertToDTO(userProject);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            // Manejo específico de errores de validación
            return new ResponseEntity<>(new ErrorResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse("Error interno del servidor"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ - Obtener todos los usuarios de un proyecto
    @GetMapping("/userlist/{projectId}/users")
    public ResponseEntity<List<UserProjectDTO>> getUsersByProject(@PathVariable int projectId) {
        try {
            List<UserProject> userProjects = userProjectService.getUsersByProject(projectId);

            List<UserProjectDTO> userProjectDTOs = userProjects.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(userProjectDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ - Obtener todos los proyectos de un usuario
    @GetMapping("/user/{userId}/projects")
    public ResponseEntity<List<UserProjectDTO>> getProjectsByUser(@PathVariable int userId) {
        try {
            List<UserProject> userProjects = userProjectService.getProjectsByUser(userId);

            List<UserProjectDTO> userProjectDTOs = userProjects.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(userProjectDTOs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ - Obtener un UserProject específico por ID
    @GetMapping("/userproject/{userProjectId}")
    public ResponseEntity<UserProjectDTO> getUserProjectById(@PathVariable int userProjectId) {
        try {
            Optional<UserProject> userProject = userProjectService.getUserProjectByID(userProjectId);

            if (userProject.isPresent()) {
                UserProjectDTO dto = convertToDTO(userProject.get());
                return new ResponseEntity<>(dto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // UPDATE - Actualizar rol de un usuario en un proyecto
    @PutMapping("/userproject/{userProjectId}")
    public ResponseEntity<UserProjectDTO> updateUserProjectRole(@PathVariable int userProjectId, @RequestBody UpdateRoleRequest request) {
        try {
            UserProject updatedUserProject = userProjectService.updateUserProjectRole(userProjectId, request.getRole());

            if (updatedUserProject != null) {
                UserProjectDTO dto = convertToDTO(updatedUserProject);
                return new ResponseEntity<>(dto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE - Remover usuario de un proyecto
    @DeleteMapping("/userproject/{userProjectId}")
    public ResponseEntity<String> removeUserFromProject(@PathVariable int userProjectId) {
        try {
            boolean deleted = userProjectService.deleteUserProject(userProjectId);

            if (deleted) {
                return new ResponseEntity<>("Usuario removido del proyecto exitosamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("UserProject no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private UserProjectDTO convertToDTO(UserProject userProject) {
        User user = userProject.getUser();
        return new UserProjectDTO(
                userProject.getID(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getTelegramUsername(),
                user.getAvatar(),
                userProject.getRole(),
                userProject.getProject().getID(),
                userProject.getProject().getName()
        );
    }

    @Setter
    @Getter
    public static class AssignUserRequest {
        private int userId;
        private int projectId;
        private String role;

        public AssignUserRequest() {}
    }

    @Getter
    @Setter
    public static class UpdateRoleRequest {
        private String role;
        public UpdateRoleRequest() {}
    }

    @Getter
    @Setter
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }
}