package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Shortcut;
import com.springboot.MyTodoList.service.ShortcutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shortcuts")
public class ShortcutController {

    @Autowired
    private ShortcutService shortcutService;

    @GetMapping
    public ResponseEntity<List<Shortcut>> getAllShortcuts() {
        return shortcutService.getAllShortcuts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shortcut> getShortcutByID(@PathVariable int id) {
        try {
            return shortcutService.getShortcutById(id);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Shortcut> addShortcut(@RequestBody Shortcut shortcut) {
        return shortcutService.saveShortcut(shortcut);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteShortcut(@PathVariable int id) {
        Boolean flag = shortcutService.deleteShortcut(id);
        return new ResponseEntity<>(flag, flag ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }
}
