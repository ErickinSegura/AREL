package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Shortcut;
import com.springboot.MyTodoList.service.ShortcutService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ShortcutControllerTest {

    private ShortcutService shortcutService;
    private ShortcutController shortcutController;

    @BeforeEach
    public void setUp() {
        shortcutService = mock(ShortcutService.class);
        shortcutController = new ShortcutController(shortcutService);
    }

    @Test
    public void testGetAllShortcuts() {
        List<Shortcut> shortcuts = List.of(new Shortcut(1, "http://localhost:8080", "Test Shortcut"));
        when(shortcutService.getAllShortcuts()).thenReturn(ResponseEntity.ok(shortcuts));
        ResponseEntity<List<Shortcut>> response = shortcutController.getAllShortcuts();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    public void testGetShortcutByID() {
        int id = 1;
        Shortcut shortcut = new Shortcut(1, "http://localhost:8080", "Test Shortcut");

        when(shortcutService.getShortcutById(id)).thenReturn(ResponseEntity.ok(shortcut));

        ResponseEntity<Shortcut> response = shortcutController.getShortcutByID(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("http://example.com", response.getBody().getURL());
    }

    @Test
    public void testAddShortcut() {
        Shortcut shortcut = new Shortcut(1, "http://localhost:8080", "Test Shortcut");

        when(shortcutService.saveShortcut(any(Shortcut.class)))
                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).body(shortcut));

    @Test
    void testAddShortcutSuccess() {
        Shortcut shortcut = new Shortcut(1, "http://example.com");
        when(shortcutService.saveShortcut(shortcut)).thenReturn(ResponseEntity.status(HttpStatus.CREATED).body(shortcut));
        ResponseEntity<Shortcut> response = shortcutController.addShortcut(shortcut);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("http://example.com", response.getBody().getURL());
    }

    @Test
    void testUpdateShortcutSuccess() {
        int id = 1;
        Shortcut updated = new Shortcut(1, "http://localhost:8080/updated", "Updated Shortcut");

        when(shortcutService.getShortcutById(id)).thenReturn(ResponseEntity.ok(updated));

        when(shortcutService.updateShortcut(eq(id), any(Shortcut.class)))
                .thenReturn(ResponseEntity.ok(updated));

        ResponseEntity<Shortcut> response = shortcutController.updateShortcut(id, updated);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("http://updated.com", response.getBody().getURL());
    }

    @Test
    void testDeleteShortcutSuccess() {
        int id = 1;
        when(shortcutService.deleteShortcut(id)).thenReturn(true);
        ResponseEntity<Boolean> response = shortcutController.deleteShortcut(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
    }

    @Test
    void testDeleteShortcutNotFound() {
        int id = 999;
        when(shortcutService.deleteShortcut(id)).thenReturn(false);
        ResponseEntity<Boolean> response = shortcutController.deleteShortcut(id);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertFalse(response.getBody());
    }

    @Test
    void testAddShortcutWithInvalidUrl() {
        Shortcut shortcut = new Shortcut(1, "invalid-url");
        when(shortcutService.saveShortcut(shortcut))
            .thenThrow(new IllegalArgumentException("Invalid URL format"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            shortcutController.addShortcut(shortcut);
        });
        assertEquals("Invalid URL format", exception.getMessage());
    }

    /*@Test
    void testUpdateShortcutWithMismatchedId() {
        int id = 1;
        Shortcut shortcut = new Shortcut(2, "http://example.com");
        ResponseEntity<Shortcut> response = shortcutController.updateShortcut(id, shortcut);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    @Test
    void testGetAllShortcutsEmpty() {
        when(shortcutService.getAllShortcuts())
            .thenReturn(ResponseEntity.ok(Collections.emptyList()));
        ResponseEntity<List<Shortcut>> response = shortcutController.getAllShortcuts();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    /*@Test
    void testGetShortcutByIdWithInvalidId() {
        ResponseEntity<Shortcut> response = shortcutController.getShortcutByID(-1);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }*/

    @Test
    void testAddShortcutWithNullUrl() {
        Shortcut shortcut = new Shortcut(1, null);
        when(shortcutService.saveShortcut(shortcut))
            .thenThrow(new IllegalArgumentException("URL cannot be null"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            shortcutController.addShortcut(shortcut);
        });
        assertEquals("URL cannot be null", exception.getMessage());
    }
    
    @Test
    void testUpdateShortcutConcurrentModification() {
        int id = 1;
        Shortcut shortcut = new Shortcut(id, "http://example.com");
        when(shortcutService.updateShortcut(id, shortcut))
            .thenThrow(new RuntimeException("Concurrent modification detected"));
        Exception exception = assertThrows(RuntimeException.class, () -> {
            shortcutController.updateShortcut(id, shortcut);
        });
        assertEquals("Concurrent modification detected", exception.getMessage());
    }

    @Test
    void testAddShortcutWithMaxLengthUrl() {
        String maxLengthUrl = "http://example.com/" + String.join("", Collections.nCopies(2048, "a"));
        Shortcut shortcut = new Shortcut(1, maxLengthUrl);
        when(shortcutService.saveShortcut(shortcut))
            .thenThrow(new IllegalArgumentException("URL exceeds maximum length"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            shortcutController.addShortcut(shortcut);
        });
        assertEquals("URL exceeds maximum length", exception.getMessage());
    }

    @Test
    void testUpdateShortcutWithEmptyUrl() {
        int id = 1;
        Shortcut shortcut = new Shortcut(id, "");
        when(shortcutService.updateShortcut(id, shortcut))
            .thenThrow(new IllegalArgumentException("URL cannot be empty"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            shortcutController.updateShortcut(id, shortcut);
        });
        assertEquals("URL cannot be empty", exception.getMessage());
    }

    @Test
    void testAddShortcutWithDuplicateUrl() {
        Shortcut shortcut = new Shortcut(1, "http://example.com");
        when(shortcutService.saveShortcut(shortcut))
            .thenThrow(new IllegalStateException("URL already exists"));
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            shortcutController.addShortcut(shortcut);
        });
        assertEquals("URL already exists", exception.getMessage());
    }

    @Test
    void testAddShortcutWithMaliciousUrl() {
        Shortcut shortcut = new Shortcut(1, "javascript:alert(1)");
        when(shortcutService.saveShortcut(shortcut))
            .thenThrow(new IllegalArgumentException("Invalid URL scheme"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            shortcutController.addShortcut(shortcut);
        });
        assertEquals("Invalid URL scheme", exception.getMessage());
    }

    @Test
    void testUpdateShortcutWithLocalHostUrl() {
        int id = 1;
        Shortcut shortcut = new Shortcut(id, "http://localhost:8080/api");
        when(shortcutService.updateShortcut(id, shortcut))
            .thenThrow(new IllegalArgumentException("Local URLs are not allowed"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            shortcutController.updateShortcut(id, shortcut);
        });
        assertEquals("Local URLs are not allowed", exception.getMessage());
    }

    @Test
    void testAddShortcutWithCircularRedirect() {
        Shortcut shortcut = new Shortcut(1, "http://example.com/redirect-loop");
        when(shortcutService.saveShortcut(shortcut))
            .thenThrow(new IllegalArgumentException("Circular redirect detected"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            shortcutController.addShortcut(shortcut);
        });
        assertEquals("Circular redirect detected", exception.getMessage());
    }

    @Test
    void testUpdateShortcutWithVersionConflict() {
        int id = 1;
        Shortcut shortcut = new Shortcut(id, "http://example.com");
        when(shortcutService.updateShortcut(id, shortcut))
            .thenThrow(new RuntimeException("Version conflict"));
        Exception exception = assertThrows(RuntimeException.class, () -> {
            shortcutController.updateShortcut(id, shortcut);
        });
        assertEquals("Version conflict", exception.getMessage());
    }
}