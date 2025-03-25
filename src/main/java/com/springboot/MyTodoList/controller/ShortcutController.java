package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.model.Shortcut;
import com.springboot.MyTodoList.service.ShortcutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.net.URI;
import java.util.List;

@RestController
public class ShortcutController {
    @Autowired
    private ShortcutService shortcutService;
    //@CrossOrigin
    @GetMapping(value = "/Shortcut")
    public List<Shortcut> getAllShortcut(){
        return shortcutService.findAll();
    }
    //@CrossOrigin
    @GetMapping(value = "/Shortcut/{id}")
    public ResponseEntity<Shortcut> getShortcutByID(@PathVariable int id){
        try{
            ResponseEntity<Shortcut> responseEntity = shortcutService.getItemById(id);
            return new ResponseEntity<Shortcut>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @PostMapping(value = "/shortcutlist")
    public ResponseEntity addShortcut(@RequestBody Shortcut shortcut) throws Exception{
        Shortcut us = shortcutService.addShortcut(shortcut);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location",""+us.getID());
        responseHeaders.set("Access-Control-Expose-Headers","location");
        //URI location = URI.create(""+td.getID())

        return ResponseEntity.ok()
                .headers(responseHeaders).build();
    }
    //@CrossOrigin
    @PutMapping(value = "Shortcut/{id}")
    public ResponseEntity updateShortcut(@RequestBody Shortcut shortcut, @PathVariable int id){
        try{
            Shortcut us = shortcutService.updateShortcut(id, shortcut);
            System.out.println(us.toString());
            return new ResponseEntity<>(us,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @DeleteMapping(value = "shortcutlist/{id}")
    public ResponseEntity<Boolean> deleteShortcut(@PathVariable("id") int id){
        Boolean flag = false;
        try{
            flag = shortcutService.deleteShortcut(id);
            return new ResponseEntity<>(flag, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(flag,HttpStatus.NOT_FOUND);
        }
    }
}
