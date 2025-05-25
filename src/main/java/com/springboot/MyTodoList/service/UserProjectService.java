package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.repository.UserProjectRepository;
import com.springboot.MyTodoList.repository.UserRepository;
import com.springboot.MyTodoList.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserProjectService {

    @Autowired
    private UserProjectRepository userProjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public UserProject assignUserToProject(int userId, int projectId, String role) {
        // Buscar el usuario
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Usuario no encontrado con ID: " + userId);
        }

        User user = userOpt.get();

        // Validar si el usuario tiene userLevel = 2 y ya está asignado a algún proyecto
        if (user.getUserLevel() != null && user.getUserLevel().getID() == 2) {
            List<UserProject> existingAssignments = userProjectRepository.findByUserId(userId);
            if (!existingAssignments.isEmpty()) {
                throw new RuntimeException("El usuario con nivel 2 ya está asignado a un proyecto y no puede ser asignado a otro");
            }
        }

        // Buscar el proyecto
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (!projectOpt.isPresent()) {
            throw new RuntimeException("Proyecto no encontrado con ID: " + projectId);
        }

        Project project = projectOpt.get();

        // Verificar si el usuario ya está asignado a este proyecto específico
        Optional<UserProject> existingAssignment = userProjectRepository.findByUserIdAndProjectId(userId, projectId);
        if (existingAssignment.isPresent()) {
            throw new RuntimeException("El usuario ya está asignado a este proyecto");
        }

        // Crear la nueva asignación
        UserProject userProject = new UserProject(user, project, role);
        return userProjectRepository.save(userProject);
    }

    public List<UserProject> getUsersByProject(int projectId) {
        return userProjectRepository.findByProjectId(projectId);
    }

    public List<UserProject> getProjectsByUser(int userId) {
        return userProjectRepository.findByUserId(userId);
    }

    public Optional<UserProject> getUserProjectByID(int userProjectId) {
        return userProjectRepository.findById(userProjectId);
    }

    public UserProject updateUserProjectRole(int userProjectId, String newRole) {
        Optional<UserProject> userProjectOpt = userProjectRepository.findById(userProjectId);
        if (userProjectOpt.isPresent()) {
            UserProject userProject = userProjectOpt.get();
            userProject.setRole(newRole);
            return userProjectRepository.save(userProject);
        }
        return null;
    }

    public boolean deleteUserProject(int userProjectId) {
        if (userProjectRepository.existsById(userProjectId)) {
            userProjectRepository.deleteById(userProjectId);
            return true;
        }
        return false;
    }
}