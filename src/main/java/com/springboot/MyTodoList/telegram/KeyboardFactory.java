package com.springboot.MyTodoList.telegram;

import java.util.ArrayList;
import java.util.List;

import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import com.springboot.MyTodoList.model.Category;
import com.springboot.MyTodoList.model.Task;
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

    public InlineKeyboardMarkup inlineKeyboardManagerOpenProject(int projectID) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton seeBacklog = new InlineKeyboardButton();
        seeBacklog.setText("See Backlog");
        seeBacklog.setCallbackData("default");

        InlineKeyboardButton createTask = new InlineKeyboardButton();
        createTask.setText("Create Task");
        createTask.setCallbackData("create_task_project_"+String.valueOf(projectID));

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

    public InlineKeyboardMarkup inlineKeyboardCategorySet(List<Category> categories) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (Category category : categories) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText(category.getName());
            button.setCallbackData("set_statetask_category_" + category.getID());  // Callback data !!

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKeyboardTypeSet() {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton task = new InlineKeyboardButton();
        task.setText("Task");
        task.setCallbackData("set_statetask_type_4_task");

        InlineKeyboardButton bug = new InlineKeyboardButton();
        bug.setText("Bug");
        bug.setCallbackData("set_statetask_type_1_bug");

        InlineKeyboardButton fix = new InlineKeyboardButton();
        fix.setText("Fix");
        fix.setCallbackData("set_statetask_type_2_fix");

        InlineKeyboardButton issue = new InlineKeyboardButton();
        issue.setText("Issue");
        issue.setCallbackData("set_statetask_type_3_issue");

        keyboard.add(List.of(task, fix));
        keyboard.add(List.of(bug, issue));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKeyboardPrioritySet() {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton low = new InlineKeyboardButton();
        low.setText("Low");
        low.setCallbackData("set_statetask_priority_1_low");

        InlineKeyboardButton medium = new InlineKeyboardButton();
        medium.setText("Medium");
        medium.setCallbackData("set_statetask_priority_2_medium");

        InlineKeyboardButton high = new InlineKeyboardButton();
        high.setText("High");
        high.setCallbackData("set_statetask_priority_3_high");

        InlineKeyboardButton critical = new InlineKeyboardButton();
        critical.setText("Critical");
        critical.setCallbackData("set_statetask_priority_4_critical");

        keyboard.add(List.of(low));
        keyboard.add(List.of(medium));
        keyboard.add(List.of(high));
        keyboard.add(List.of(critical));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKeyboardPreview() {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton save = new InlineKeyboardButton();
        save.setText("Save");
        save.setCallbackData("save_task");

        InlineKeyboardButton cancel = new InlineKeyboardButton();
        cancel.setText("Cancel");
        cancel.setCallbackData("cancel_task_creation");

        keyboard.add(List.of(save));
        keyboard.add(List.of(cancel));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

}