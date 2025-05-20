package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SprintControllerTest {

    @Mock
    private SprintService sprintService;

    @InjectMocks
    private SprintController sprintController;

    private Sprint mockSprint;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockSprint = new Sprint(1, 1);
        mockSprint.setID(1);
        mockSprint.setStartDate(LocalDateTime.now());
        mockSprint.setEndDate(LocalDateTime.now().plusDays(7));
    }

    @Test
    void testGetAllSprints() {
        when(sprintService.getAllSprints(1)).thenReturn(ResponseEntity.ok(Arrays.asList(mockSprint)));
        ResponseEntity<List<Sprint>> response = sprintController.getAllSprints(1);
        assertEquals(200, response.getStatusCodeValue());
        assertFalse(response.getBody().isEmpty());
    }

    @Test
    void testGetAvailableSprints() {
        when(sprintService.getAvailableSprints(1)).thenReturn(ResponseEntity.ok(Arrays.asList(mockSprint)));
        ResponseEntity<List<Sprint>> response = sprintController.getAvailableSprints(1);
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }

    @Test
    void testAddSprint() throws Exception {
        when(sprintService.addSprint(any(Sprint.class))).thenReturn(mockSprint);
        ResponseEntity response = sprintController.addSprint(mockSprint);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getHeaders().containsKey("location"));
    }

    @Test
    void testDeleteSprint() throws Exception {
        when(sprintService.deleteSprint(1)).thenReturn(mockSprint);
        ResponseEntity response = sprintController.deleteSprint(1);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testUpdateSprint() throws Exception {
        when(sprintService.updateSprint(eq(1), any(Sprint.class))).thenReturn(mockSprint);
        ResponseEntity response = sprintController.updateSprint(1, mockSprint);
        assertEquals(200, response.getStatusCodeValue());
    }
    
    @Test
    void testGetAllSprintsEmptyList() {
        when(sprintService.getAllSprints(1)).thenReturn(ResponseEntity.ok(Collections.emptyList()));
        ResponseEntity<List<Sprint>> response = sprintController.getAllSprints(1);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void testAddSprintWithInvalidDates() throws Exception {
        Sprint invalidSprint = new Sprint(1, 1);
        invalidSprint.setStartDate(LocalDateTime.now());
        invalidSprint.setEndDate(LocalDateTime.now().minusDays(1));
        when(sprintService.addSprint(any(Sprint.class))).thenThrow(new IllegalArgumentException("Invalid dates"));
        Exception exception = assertThrows(Exception.class, () -> {
            sprintController.addSprint(invalidSprint);
        });
        assertTrue(exception.getMessage().contains("Invalid dates"));
    }

    @Test
    void testGetAllSprintsNullResponse() {
        when(sprintService.getAllSprints(1)).thenReturn(ResponseEntity.ok(null));
        ResponseEntity<List<Sprint>> response = sprintController.getAllSprints(1);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isEmpty());
    }
    
    /*@Test
    void testAddSprintWithNullData() throws Exception {
        Sprint nullSprint = null;
        Exception exception = assertThrows(Exception.class, () -> {
            sprintController.addSprint(nullSprint);
        });
        assertTrue(exception instanceof IllegalArgumentException);
    }*/
}
