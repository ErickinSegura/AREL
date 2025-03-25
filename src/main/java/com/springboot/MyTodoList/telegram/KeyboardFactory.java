package com.springboot.MyTodoList.telegram;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.model.UserProject;
import com.springboot.MyTodoList.util.BotLabels;

public class KeyboardFactory {

    public InlineKeyboardMarkup multipleProjectList(List<UserProject> userProjects, String userLevel) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (UserProject userProject : userProjects) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText(userProject.getProject().getName());
            button.setCallbackData("open_project_" + userLevel + "_" + userProject.getID());  // Callback data !!

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public ReplyKeyboardMarkup createMainMenuKeyboardManager() {
        ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
        List<KeyboardRow> keyboard = new ArrayList<>();

        // First row
        KeyboardRow row = new KeyboardRow();
        row.add(BotLabels.LIST_ALL_ITEMS.getLabel());
        row.add(BotLabels.ADD_NEW_ITEM.getLabel());
        keyboard.add(row);

        // Second row
        row = new KeyboardRow();
        row.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
        row.add(BotLabels.HIDE_MAIN_SCREEN.getLabel());
        keyboard.add(row);

        keyboardMarkup.setKeyboard(keyboard);
        return keyboardMarkup;
    }

    public InlineKeyboardMarkup taskInfoInLineKeyboard(Task task) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        String nextLabel = "";
        String nextCallBack = "";
        String currentTaskStateLabel = task.getState().getLabel();
        if ("todo".equals(currentTaskStateLabel)) {
            nextLabel = "Set task to \"Doing\"";
            nextCallBack = "set_task_state_" + task.getID() + "_doing";
        } else if ("doing".equals(currentTaskStateLabel)) {
            nextLabel = "Set task to \"Done\"";
            nextCallBack = "set_task_state_" + task.getID() + "_done";
        }

        InlineKeyboardButton back = new InlineKeyboardButton();
        back.setText("Go back");
        back.setCallbackData("restart");

        if (!nextLabel.isEmpty()) {
            InlineKeyboardButton next = new InlineKeyboardButton();
            next.setText(nextLabel);
            next.setCallbackData(nextCallBack);
            keyboard.add(List.of(next, back));
        } else {
            keyboard.add(List.of(back));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup createInlineKeyboardFromTasks(List<Task> taskList) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (Task task : taskList) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText(task.getTitle());
            button.setCallbackData("taskinfo_" + task.getID());  // Callback data !!

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKeyboardManagerOpenProject() {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton seeBacklog = new InlineKeyboardButton();
        seeBacklog.setText("See Backlog");
        seeBacklog.setCallbackData("default");

        InlineKeyboardButton createTask = new InlineKeyboardButton();
        createTask.setText("Create Task");
        createTask.setCallbackData("default");

        InlineKeyboardButton seeSprint = new InlineKeyboardButton();
        seeSprint.setText("See Sprint");
        seeSprint.setCallbackData("default");

        InlineKeyboardButton goBack = new InlineKeyboardButton();
        goBack.setText("Go Back");
        goBack.setCallbackData("default");

        keyboard.add(List.of(seeBacklog, createTask));
        keyboard.add(List.of(seeSprint, goBack));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }



    public ReplyKeyboardMarkup createToDoListKeyboard(List<ToDoItem> allItems) {
        ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
        List<KeyboardRow> keyboard = new ArrayList<>();

        // Top navigation row
        KeyboardRow mainScreenRowTop = new KeyboardRow();
        mainScreenRowTop.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
        keyboard.add(mainScreenRowTop);

        // Add item row
        KeyboardRow firstRow = new KeyboardRow();
        firstRow.add(BotLabels.ADD_NEW_ITEM.getLabel());
        keyboard.add(firstRow);

        // List title row
        KeyboardRow myTodoListTitleRow = new KeyboardRow();
        myTodoListTitleRow.add(BotLabels.MY_TODO_LIST.getLabel());
        keyboard.add(myTodoListTitleRow);

        // Active items
        List<ToDoItem> activeItems = allItems.stream()
                .filter(item -> !item.isDone())
                .collect(Collectors.toList());

        for (ToDoItem item : activeItems) {
            KeyboardRow currentRow = new KeyboardRow();
            currentRow.add(item.getDescription());
            currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.DONE.getLabel());
            keyboard.add(currentRow);
        }

        // Done items
        List<ToDoItem> doneItems = allItems.stream()
                .filter(ToDoItem::isDone)
                .collect(Collectors.toList());

        for (ToDoItem item : doneItems) {
            KeyboardRow currentRow = new KeyboardRow();
            currentRow.add(item.getDescription());
            currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.UNDO.getLabel());
            currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.DELETE.getLabel());
            keyboard.add(currentRow);
        }

        // Bottom navigation row
        KeyboardRow mainScreenRowBottom = new KeyboardRow();
        mainScreenRowBottom.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
        keyboard.add(mainScreenRowBottom);

        keyboardMarkup.setKeyboard(keyboard);
        return keyboardMarkup;
    }
}