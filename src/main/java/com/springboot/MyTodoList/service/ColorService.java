package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Color;
import com.springboot.MyTodoList.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorService {

    @Autowired
    private ColorRepository colorRepository;
    public List<Color> findAll(){
        List<Color> colors = colorRepository.findAll();
        return colors;
    }
    public ResponseEntity<Color> getItemById(int id){
        Optional<Color> colorData = colorRepository.findById(id);
        if (colorData.isPresent()){
            return new ResponseEntity<>(colorData.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public Color addColor(Color color){
        return colorRepository.save(color);
    }

    public boolean deleteColor(int id){
        try{
            colorRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }
    }
    public Color updateColor(int id, Color color){
        Optional<Color> colorData = colorRepository.findById(id);
        if(colorData.isPresent()){
            Color colorItem = colorData.get();
            colorItem.setID(id);
            colorItem.setHexColor(color.getHexColor());
            
            return colorRepository.save(colorItem);
        }else{
            return null;
        }
    }

}
