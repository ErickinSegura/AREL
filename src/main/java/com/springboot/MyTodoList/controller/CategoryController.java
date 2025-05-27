package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Category;
import com.springboot.MyTodoList.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/category/project/{id}")
    public ResponseEntity<List<Category>> getCategoriesByProject(@PathVariable int id) {
        return categoryService.getCategoriesByProject(id);
    }

    @PostMapping("/category")
    public ResponseEntity<Category> saveCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable int id, @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<HttpStatus> deleteCategory(@PathVariable int id) {
        return categoryService.deleteCategory(id);
    }
}
