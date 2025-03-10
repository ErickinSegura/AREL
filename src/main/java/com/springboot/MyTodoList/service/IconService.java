package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Icon;
import com.springboot.MyTodoList.repository.IconRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IconService {

    @Autowired
    private IconRepository iconRepository;
    public List<Icon> findAll(){
        List<Icon> icons = iconRepository.findAll();
        return icons;
    }
    public ResponseEntity<Icon> getItemById(int id){
        Optional<Icon> iconData = iconRepository.findById(id);
        if (iconData.isPresent()){
            return new ResponseEntity<>(iconData.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public Icon addIcon(Icon icon){
        return iconRepository.save(icon);
    }

    public boolean deleteIcon(int id){
        try{
            iconRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }
    }
    public Icon updateIcon(int id, Icon icon){
        Optional<Icon> iconData = iconRepository.findById(id);
        if(iconData.isPresent()){
            Icon iconItem = iconData.get();
            iconItem.setID(id);
            iconItem.setIconName(icon.getIconName());
            
            return iconRepository.save(iconItem);
        }else{
            return null;
        }
    }

}
