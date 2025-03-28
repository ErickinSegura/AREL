package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Shortcut;
import com.springboot.MyTodoList.repository.ShortcutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShortcutService {
    @Autowired
    private final ShortcutRepository shortcutRepository;
    public ShortcutService(ShortcutRepository shortcutRepository) {
        this.shortcutRepository = shortcutRepository;
    }

    public ResponseEntity<List<Shortcut>> getAllShortcuts() {
        List<Shortcut> shortcuts = shortcutRepository.findAll();
        if (shortcuts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(shortcuts, HttpStatus.OK);
    }

    public ResponseEntity<Shortcut> getShortcutById(int id) {
        Optional<Shortcut> shortcutData = shortcutRepository.findById(id);
        if (shortcutData.isPresent()) {
            return new ResponseEntity<>(shortcutData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<Shortcut>> getShortcutsByProject(int projectId) {
        List<Shortcut> shortcuts = shortcutRepository.findByProjectId(projectId);
        if (shortcuts.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(shortcuts, HttpStatus.OK);
    }

    public ResponseEntity<Shortcut> saveShortcut(Shortcut shortcut) {
        try {
            Shortcut savedShortcut = shortcutRepository.save(shortcut);
            return new ResponseEntity<>(savedShortcut, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public boolean deleteShortcut(int id){
        try{
            shortcutRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }
    }
}