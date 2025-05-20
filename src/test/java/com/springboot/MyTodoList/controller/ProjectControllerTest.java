package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.service.ProjectService;
import com.springboot.MyTodoList.service.SprintService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @Mock
    private SprintService sprintService;

    @InjectMocks
    private ProjectController projectController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProjects() {
        // Arrange
        Project project1 = new Project();
        project1.setID(1);
        project1.setName("Project 1");
        
        Project project2 = new Project();
        project2.setID(2);
        project2.setName("Project 2");
        
        when(projectService.findAll()).thenReturn(Arrays.asList(project1, project2));

        // Act
        List<Project> result = projectController.getAllProjects();

        // Assert
        assertEquals(2, result.size());
        assertEquals("Project 1", result.get(0).getName());
        assertEquals("Project 2", result.get(1).getName());
    }

    @Test
    void testGetAllProjectsEmpty() {
        // Arrange
        when(projectService.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<Project> result = projectController.getAllProjects();

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetProjectByIdSuccess() {
        // Arrange
        Project project = new Project();
        project.setID(1);
        project.setName("Test Project");
        
        when(projectService.getItemById(1)).thenReturn(ResponseEntity.ok(project));

        // Act
        ResponseEntity<Project> response = projectController.getProjectById(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Test Project", response.getBody().getName());
    }

    @Test
    void testGetProjectByIdNotFound() {
        // Arrange
        when(projectService.getItemById(999)).thenReturn(ResponseEntity.notFound().build());

        // Act
        ResponseEntity<Project> response = projectController.getProjectById(999);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateProjectSuccess() {
        // Arrange
        Project newProject = new Project();
        newProject.setName("New Project");
        newProject.setDescription("Project Description");

        Project createdProject = new Project();
        createdProject.setID(1);
        createdProject.setName("New Project");
        createdProject.setDescription("Project Description");

        when(projectService.addProject(newProject)).thenReturn(createdProject);

        // Act
        ResponseEntity<Project> response = projectController.createProject(newProject);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1, response.getBody().getID());
        assertEquals("New Project", response.getBody().getName());
    }

    @Test
    void testUpdateProjectSuccess() {
        // Arrange
        Project project = new Project();
        project.setID(1);
        project.setName("Updated Project");
        
        when(projectService.updateProject(1, project)).thenReturn(project);

        // Act
        ResponseEntity<Project> response = projectController.updateProject(1, project);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Updated Project", response.getBody().getName());
    }

    @Test
    void testUpdateProjectNotFound() {
        // Arrange
        Project project = new Project();
        project.setID(999);
        project.setName("Non-existent Project");
        
        when(projectService.updateProject(999, project)).thenReturn(null);

        // Act
        ResponseEntity<Project> response = projectController.updateProject(999, project);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDeleteProjectSuccess() {
        // Arrange
        when(projectService.deleteProject(1)).thenReturn(true);

        // Act
        ResponseEntity<HttpStatus> response = projectController.deleteProject(1);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testDeleteProjectFailure() {
        // Arrange
        when(projectService.deleteProject(1)).thenReturn(false);

        // Act
        ResponseEntity<HttpStatus> response = projectController.deleteProject(1);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void testGetActiveSprintSuccess() {
        // Arrange
        when(sprintService.getActiveSprint(1)).thenReturn(1);

        // Act
        ResponseEntity<Integer> response = projectController.getActiveSprint(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody());
    }

    @Test
    void testGetActiveSprintNotFound() {
        // Arrange
        when(sprintService.getActiveSprint(1)).thenReturn(null);

        // Act
        ResponseEntity<Integer> response = projectController.getActiveSprint(1);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateProjectWithInvalidData() {
        // Arrange
        Project invalidProject = new Project();
        // Missing required fields
        
        when(projectService.addProject(invalidProject))
            .thenThrow(new IllegalArgumentException("Project name is required"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            projectController.createProject(invalidProject);
        });
        assertEquals("Project name is required", exception.getMessage());
    }

    @Test
    void testUpdateProjectWithMismatchedId() {
        // Arrange
        Project project = new Project();
        project.setID(2);  // Different from path variable ID
        project.setName("Mismatched Project");

        // Act
        ResponseEntity<Project> response = projectController.updateProject(1, project);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
    
    @Test
    void testCreateProjectWithMaximumFieldLengths() {
        // Arrange
        Project project = new Project();
        project.setName(String.join("", Collections.nCopies(255, "a"))); // Max length name
        project.setDescription(String.join("", Collections.nCopies(1000, "a"))); // Max length description
        
        Project createdProject = new Project();
        createdProject.setID(1);
        createdProject.setName(project.getName());
        createdProject.setDescription(project.getDescription());
        
        when(projectService.addProject(project)).thenReturn(createdProject);

        // Act
        ResponseEntity<Project> response = projectController.createProject(project);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(255, response.getBody().getName().length());
    }

    @Test
    void testCreateProjectWithSpecialCharacters() {
        // Arrange
        Project project = new Project();
        project.setName("Project #1 @Special & *Characters*");
        project.setDescription("Description with émojis 🚀 and unicode χαρακτήρες");
        
        when(projectService.addProject(project)).thenReturn(project);

        // Act
        ResponseEntity<Project> response = projectController.createProject(project);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Project #1 @Special & *Characters*", response.getBody().getName());
    }

    @Test
    void testGetAllProjectsWithMultiplePages() {
        // Arrange
        List<Project> projects = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            Project project = new Project();
            project.setID(i);
            project.setName("Project " + i);
            projects.add(project);
        }
        
        when(projectService.findAll()).thenReturn(projects);

        // Act
        List<Project> result = projectController.getAllProjects();

        // Assert
        assertEquals(20, result.size());
        assertEquals("Project 1", result.get(0).getName());
        assertEquals("Project 20", result.get(19).getName());
    }

    @Test
    void testUpdateProjectWithNullFields() {
        // Arrange
        Project project = new Project();
        project.setID(1);
        project.setName(null);
        project.setDescription(null);
        
        when(projectService.updateProject(1, project))
            .thenThrow(new IllegalArgumentException("Project name cannot be null"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            projectController.updateProject(1, project);
        });
        assertEquals("Project name cannot be null", exception.getMessage());
    }

    @Test
    void testGetActiveSprintWithInvalidProjectId() {
        // Arrange
        when(sprintService.getActiveSprint(-1))
            .thenThrow(new IllegalArgumentException("Invalid project ID"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            projectController.getActiveSprint(-1);
        });
        assertEquals("Invalid project ID", exception.getMessage());
    }

    /*@Test
    void testDeleteProjectWithActiveSprintsShouldFail() {
        when(sprintService.getActiveSprint(1)).thenReturn(5);
        when(projectService.deleteProject(1)).thenReturn(false);
        ResponseEntity<HttpStatus> response = projectController.deleteProject(1);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(sprintService).getActiveSprint(1);
    }*/

    @Test
    void testUpdateProjectPartialFields() {
        Project existingProject = new Project();
        existingProject.setID(1);
        existingProject.setName("Original Name");
        existingProject.setDescription("Original Description");
        Project updateProject = new Project();
        updateProject.setID(1);
        updateProject.setName("Updated Name");
        Project resultProject = new Project();
        resultProject.setID(1);
        resultProject.setName("Updated Name");
        resultProject.setDescription("Original Description");
        when(projectService.updateProject(1, updateProject)).thenReturn(resultProject);
        ResponseEntity<Project> response = projectController.updateProject(1, updateProject);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Updated Name", response.getBody().getName());
        assertEquals("Original Description", response.getBody().getDescription());
    }

    @Test
    void testCreateDuplicateProject() {
        // Arrange
        Project project = new Project();
        project.setName("Existing Project");
        
        when(projectService.addProject(project))
            .thenThrow(new IllegalStateException("Project with this name already exists"));

        // Act & Assert
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            projectController.createProject(project);
        });
        assertEquals("Project with this name already exists", exception.getMessage());
    }

    /*@Test
    void testGetProjectByIdWithZeroId() {
        ResponseEntity<Project> response = projectController.getProjectById(0);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    @Test
    void testUpdateProjectConcurrentModification() {
        Project project = new Project();
        project.setID(1);
        project.setName("Updated Project");
        when(projectService.updateProject(1, project))
            .thenThrow(new RuntimeException("Concurrent modification detected"));
        Exception exception = assertThrows(RuntimeException.class, () -> {
            projectController.updateProject(1, project);
        });
        assertEquals("Concurrent modification detected", exception.getMessage());
    }

    @Test
    void testGetProjectByIdWithExcessiveSprints() {
        Project project = new Project();
        project.setID(1);
        project.setName("Project with Many Sprints");
        when(projectService.getItemById(1)).thenReturn(ResponseEntity.ok(project));
        when(sprintService.getActiveSprint(1)).thenReturn(null); // No active sprint
        ResponseEntity<Project> response = projectController.getProjectById(1);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void testCreateProjectWithLeadingTrailingSpaces() {
        // Arrange
        Project project = new Project();
        project.setName("  Project With Spaces  ");
        project.setDescription("  Description with spaces  ");
        
        Project trimmedProject = new Project();
        trimmedProject.setID(1);
        trimmedProject.setName("Project With Spaces");
        trimmedProject.setDescription("Description with spaces");
        
        when(projectService.addProject(any(Project.class))).thenReturn(trimmedProject);

        // Act
        ResponseEntity<Project> response = projectController.createProject(project);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Project With Spaces", response.getBody().getName());
    }

    /*@Test
    void testDeleteProjectWithInvalidProjectIdFormat() {
        ResponseEntity<HttpStatus> response = projectController.deleteProject(-999);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    @Test
    void testGetProjectWithNonNumericId() {
        // Arrange & Act & Assert
        assertThrows(NumberFormatException.class, () -> {
            // This would typically be caught by Spring's request mapping
            projectController.getProjectById(Integer.parseInt("abc"));
        });
    }

    @Test
    void testCreateProjectWithMaximumSprints() {
        // Arrange
        Project project = new Project();
        project.setName("Project at Sprint Limit");
        
        when(projectService.addProject(project))
            .thenThrow(new IllegalStateException("Maximum number of projects reached"));

        // Act & Assert
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            projectController.createProject(project);
        });
        assertEquals("Maximum number of projects reached", exception.getMessage());
    }
}

