package com.springboot.MyTodoList.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceManager {
    
    public final CategoryService category;
    public final ColorService color;
    public final IconService icon;
    public final ShortcutService shortcut;
    public final UserLevelService userLevel;
    public final ToDoItemService todoItem;
    public final UserService user;
    public final UserProjectService userProject;
    public final ProjectService project;

    @Autowired
    public ServiceManager(ToDoItemService todoItem, 
                          UserService user, 
                          UserProjectService userProject,
                          ProjectService project,
                          CategoryService category,
                          ColorService color,
                          IconService icon,
                          ShortcutService shortcut,
                          UserLevelService userLevel) {
        this.todoItem = todoItem;
        this.user = user;
        this.userProject = userProject;
        this.project = project;
        this.category = category;
        this.color = color;
        this.icon = icon;
        this.shortcut = shortcut;
        this. userLevel = userLevel;
    }
}
