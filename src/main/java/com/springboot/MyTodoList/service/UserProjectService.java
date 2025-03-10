package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.repository.ProjectRepository;
import com.springboot.MyTodoList.repository.UserProjectRepository;
import com.springboot.MyTodoList.repository.UserRepository;

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
        Optional<User> user = userRepository.findById(userId);
        Optional<Project> project = projectRepository.findById(projectId);

        if (user.isPresent() && project.isPresent()) {
            UserProject userProject = new UserProject(user.get(), project.get(), role);
            return userProjectRepository.save(userProject);
        }
        return null;
    }

    public List<UserProject> getProjectsByUser(int userId) {
        return userProjectRepository.findByUserId(userId);
    }

    public List<UserProject> getUsersByProject(int projectId) {
        return userProjectRepository.findByProjectId(projectId);
    }
}
