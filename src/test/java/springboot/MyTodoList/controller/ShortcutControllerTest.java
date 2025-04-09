package springboot.MyTodoList.controller;

import com.springboot.MyTodoList.controller.ShortcutController;
import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Shortcut;
import com.springboot.MyTodoList.service.ShortcutService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

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
        List<Shortcut> shortcuts = List.of(new Shortcut(new Project(), "http://localhost:8080"));
        when(shortcutService.getAllShortcuts()).thenReturn(ResponseEntity.ok(shortcuts));

        ResponseEntity<List<Shortcut>> response = shortcutController.getAllShortcuts();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(shortcuts, response.getBody());
    }

    @Test
    public void testGetShortcutByID() {
        int id = 1;
        Shortcut shortcut = new Shortcut(new Project(), "http://localhost:8080");

        when(shortcutService.getShortcutById(id)).thenReturn(ResponseEntity.ok(shortcut));

        ResponseEntity<Shortcut> response = shortcutController.getShortcutByID(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(shortcut, response.getBody());
    }

    @Test
    public void testAddShortcut() {
        Shortcut shortcut = new Shortcut(new Project(), "http://localhost:8080");

        when(shortcutService.saveShortcut(any(Shortcut.class)))
                .thenReturn(ResponseEntity.status(HttpStatus.CREATED).body(shortcut));

        ResponseEntity<Shortcut> response = shortcutController.addShortcut(shortcut);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(shortcut, response.getBody());
    }

    @Test
    public void testUpdateShortcut() {
        int id = 1;
        Shortcut updated = new Shortcut(new Project(), "http://localhost:8080/updated");

        when(shortcutService.updateShortcut(eq(id), any(Shortcut.class)))
                .thenReturn(ResponseEntity.ok(updated));

        ResponseEntity<Shortcut> response = shortcutController.updateShortcut(id, updated);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updated, response.getBody());
    }

    @Test
    public void testDeleteShortcut() {
        int id = 1;
        when(shortcutService.deleteShortcut(id)).thenReturn(true);

        ResponseEntity<Boolean> response = shortcutController.deleteShortcut(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
    }

    @Test
    public void testDeleteShortcutNotFound() {
        int id = 999;
        when(shortcutService.deleteShortcut(id)).thenReturn(false);

        ResponseEntity<Boolean> response = shortcutController.deleteShortcut(id);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertFalse(response.getBody());
    }

    @Test
    public void testGetShortcutIdsByProject() {
        int projectId = 99;
        List<Integer> ids = List.of(1, 2, 3);

        when(shortcutService.getShortcutIdsByProject(projectId))
                .thenReturn(ResponseEntity.ok(ids));

        ResponseEntity<List<Integer>> response = shortcutController.getShortcutIdsByProject(projectId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ids, response.getBody());
    }
}