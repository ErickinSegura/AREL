package com.springboot.MyTodoList.telegram;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import com.springboot.MyTodoList.model.Category;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.UserProject;

public class KeyboardFactory {

    public InlineKeyboardMarkup sprintList(List<Sprint> sprints, int currentSprint) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        if (sprints.size() > 0) {
            int projectId = sprints.get(0).getProject();

            InlineKeyboardButton newSprint = new InlineKeyboardButton();
            newSprint.setText("Create Sprint");
            newSprint.setCallbackData("create_sprint_"+projectId);
            keyboard.add(List.of(newSprint));

            for (Sprint sprint : sprints) {

                DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("MMM dd", Locale.ENGLISH);

                InlineKeyboardButton button = new InlineKeyboardButton();

                String currentOrDate = "";
                if (sprint.getID() == currentSprint){
                    currentOrDate = "(Current, ends " + sprint.getEndDate().format(dateFormat) + ")"; 
                }else {
                    String endDate = sprint.getEndDate().format(dateFormat);
                    String startDate = sprint.getStartDate().format(dateFormat);
                    currentOrDate = "(" + startDate + " to " + endDate + ")";
                }
                button.setText("Sprint " + sprint.getSprintNumber() + " " + currentOrDate);
                button.setCallbackData("open_sprint_" + sprint.getID());  // Callback data !!

                keyboard.add(List.of(button));
            }
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

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

    public InlineKeyboardMarkup assignTaskInlineMarkup(List<UserProject> userProjects, Integer task_id) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (UserProject userProject : userProjects) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            String firstName = userProject.getUser().getFirstName();
            String lastName = userProject.getUser().getLastName();
            button.setText(userProject.getRole() + " (" + firstName + " " + lastName + ")");
            button.setCallbackData("assign_task_" + task_id + "_user_" + userProject.getID());  // Callback data !!

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup assignTaskSprint(List<UserProject> userProjects, Integer task_id,
                                                 int projectId, String nextOrThis) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (UserProject userProject : userProjects) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            String firstName = userProject.getUser().getFirstName();
            String lastName = userProject.getUser().getLastName();

            button.setText(userProject.getRole()  + " (" + firstName + " " + lastName + ")");
            int id = userProject.getID();
            button.setCallbackData("assignTask"+nextOrThis+"Sprint_" + task_id + 
            "_user_" + id + "_project_" + projectId);

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
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

    public InlineKeyboardMarkup taskInfoManagerKeyboard(Task task) {
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
        back.setText("Move Task to Backlog");
        back.setCallbackData("move_task_backlog_" + task.getID());

        if (!nextLabel.isEmpty()) {
            InlineKeyboardButton next = new InlineKeyboardButton();
            next.setText(nextLabel);
            next.setCallbackData(nextCallBack);
            keyboard.add(List.of(next, back));
        } else {
            keyboard.add(List.of(back));
        }

        UserProject assignation = task.getAssignedTo();
        if (assignation == null) {
            InlineKeyboardButton assign = new InlineKeyboardButton();
            assign.setText("Assign Task");
            assign.setCallbackData("open_assign_task_"+task.getID());

            keyboard.add(List.of(assign));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup taskInfoBacklog(Task task) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton next_sprint = new InlineKeyboardButton();
        next_sprint.setText("Add to next Sprint");
        next_sprint.setCallbackData("add_next_sprint_"+String.valueOf(task.getID()));

        InlineKeyboardButton this_sprint = new InlineKeyboardButton();
        this_sprint.setText("Add to this Sprint");
        this_sprint.setCallbackData("add_this_sprint_"+String.valueOf(task.getID()));

        keyboard.add(List.of(next_sprint, this_sprint));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup confirmAddThisSprint(int taskId) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton confirm = new InlineKeyboardButton();
        confirm.setText("Yes, confirm");
        confirm.setCallbackData("confirm_this_sprint_"+taskId);

        InlineKeyboardButton next = new InlineKeyboardButton();
        next.setText("No, add to next Sprint");
        next.setCallbackData("add_next_sprint_"+taskId);
        keyboard.add(List.of(confirm, next));

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

    public InlineKeyboardMarkup inlineKeyboardManagerTaskList(List<Task> taskList) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (Task task : taskList) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText(task.getTitle());
            button.setCallbackData("taskManager_" + task.getID());  // Callback data !!

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKeyboardBacklogList(List<Task> backlog) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (Task task : backlog) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText(task.getTitle());
            button.setCallbackData("open_backlog_item_" + task.getID());

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public ReplyKeyboardMarkup replyManagerOpenProject() {
        ReplyKeyboardMarkup replyKeyboardMarkup = new ReplyKeyboardMarkup();
        List<KeyboardRow> keyboard = new ArrayList<>();

        KeyboardRow row1 = new KeyboardRow();
        row1.add("Open this Sprint");
        row1.add("Create Task");

        KeyboardRow row2 = new KeyboardRow();
        row2.add("See Backlog");
        row2.add("Sprints");

        KeyboardRow row3 = new KeyboardRow();
        row3.add("KPI Overview");

        KeyboardRow row4 = new KeyboardRow();
        row4.add("See developers' tasks");
        
        keyboard.add(row1);
        keyboard.add(row2);
        keyboard.add(row3);
        keyboard.add(row4);

        replyKeyboardMarkup.setKeyboard(keyboard);
        return replyKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKeyboardManagerOpenProject(int projectID) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton backlog = new InlineKeyboardButton();
        backlog.setText("See Backlog");
        backlog.setCallbackData("see_backlog_"+projectID);

        InlineKeyboardButton createTask = new InlineKeyboardButton();
        createTask.setText("Create Task");
        createTask.setCallbackData("create_task_project_"+projectID);

        InlineKeyboardButton seeSprint = new InlineKeyboardButton();
        seeSprint.setText("Open this Sprint");
        seeSprint.setCallbackData("open_actual_sprint_"+projectID);

        InlineKeyboardButton goBack = new InlineKeyboardButton();
        goBack.setText("Sprints");
        goBack.setCallbackData("open_sprints_"+projectID);

        InlineKeyboardButton overview = new InlineKeyboardButton();
        overview.setText("KPI Overview");
        overview.setCallbackData("kpi_"+projectID);

        InlineKeyboardButton devTasks = new InlineKeyboardButton();
        devTasks.setText("See developers' tasks");
        devTasks.setCallbackData("see_tasks_developers_"+projectID);

        //keyboard.add(List.of(seeBacklog, createTask));
        keyboard.add(List.of(seeSprint, createTask));
        keyboard.add(List.of(backlog, goBack));
        keyboard.add(List.of(overview));
        keyboard.add(List.of(devTasks));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPIMenu(Integer projectId){
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton sprints = new InlineKeyboardButton();
        sprints.setText("By Sprint");
        sprints.setCallbackData("kpi_sprints_project_" + projectId);

        InlineKeyboardButton users = new InlineKeyboardButton();
        users.setText("By Team Member");
        users.setCallbackData("kpi_users_project_" + projectId);

        keyboard.add(List.of(sprints));
        keyboard.add(List.of(users));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPISeeMore(Integer projectId, Integer userProjectID, String userName){
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton otherSprint = new InlineKeyboardButton();
        otherSprint.setText("I wanna see another sprint from " + userName);
        otherSprint.setCallbackData("kpi_user_" + userProjectID + "_" + projectId);

        InlineKeyboardButton otherKPI = new InlineKeyboardButton();
        otherKPI.setText("See Other KPIs");
        otherKPI.setCallbackData("kpi_" + projectId);

        keyboard.add(List.of(otherSprint));
        keyboard.add(List.of(otherKPI));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPISprintList(List<Sprint> sprints) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM");

        for (Sprint sprint : sprints) {

            String startDate = sprint.getStartDate().format(formatter);
            String endDate = sprint.getEndDate().format(formatter);

            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText("Sprint " + sprint.getSprintNumber() + " (" + startDate + " - " + endDate + ")");
            button.setCallbackData("kpi_sprint_" + sprint.getID() + "_" + sprint.getProject());

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPIUserSprintList(List<Sprint> sprints, Integer userProjectID, 
                                                        Integer projectID) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM");

        for (Sprint sprint : sprints) {

            String startDate = sprint.getStartDate().format(formatter);
            String endDate = sprint.getEndDate().format(formatter);

            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText("Sprint " + sprint.getSprintNumber() + " (" + startDate + " - " + endDate + ")");
            button.setCallbackData("kpi_sprintUser_" + sprint.getSprintNumber() 
                                   + "_" + userProjectID + "_" + projectID);

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPIUserList(List<UserProject> userProjects) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (UserProject userProject : userProjects) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            User user = userProject.getUser();
            String label = userProject.getRole() +
                            " (" + user.getFirstName() + 
                            " " + user.getLastName() +
                            ")";
            button.setText(label);
            button.setCallbackData("kpi_user_" + userProject.getID() + "_" + userProject.getProject().getID());

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineTasksUserList(List<UserProject> userProjects) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (UserProject userProject : userProjects) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            User user = userProject.getUser();
            String label = userProject.getRole() +
                            " (" + user.getFirstName() + 
                            " " + user.getLastName() +
                            ")";
            button.setText(label);
            button.setCallbackData("get_tasks_user_" + userProject.getID());

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPIMenu(Integer projectId){
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton sprints = new InlineKeyboardButton();
        sprints.setText("By Sprint");
        sprints.setCallbackData("kpi_sprints_project_" + projectId);

        InlineKeyboardButton users = new InlineKeyboardButton();
        users.setText("By Team Member");
        users.setCallbackData("kpi_users_project_" + projectId);

        keyboard.add(List.of(sprints));
        keyboard.add(List.of(users));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPISeeMore(Integer projectId, Integer userProjectID, String userName){
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton otherSprint = new InlineKeyboardButton();
        otherSprint.setText("I wanna see another sprint from " + userName);
        otherSprint.setCallbackData("kpi_user_" + userProjectID + "_" + projectId);

        InlineKeyboardButton otherKPI = new InlineKeyboardButton();
        otherKPI.setText("See Other KPIs");
        otherKPI.setCallbackData("kpi_" + projectId);

        keyboard.add(List.of(otherSprint));
        keyboard.add(List.of(otherKPI));

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPISprintList(List<Sprint> sprints) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM");

        for (Sprint sprint : sprints) {

            String startDate = sprint.getStartDate().format(formatter);
            String endDate = sprint.getEndDate().format(formatter);

            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText("Sprint " + sprint.getSprintNumber() + " (" + startDate + " - " + endDate + ")");
            button.setCallbackData("kpi_sprint_" + sprint.getID() + "_" + sprint.getProject());

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPIUserSprintList(List<Sprint> sprints, Integer userProjectID, 
                                                        Integer projectID) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM");

        for (Sprint sprint : sprints) {

            String startDate = sprint.getStartDate().format(formatter);
            String endDate = sprint.getEndDate().format(formatter);

            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText("Sprint " + sprint.getSprintNumber() + " (" + startDate + " - " + endDate + ")");
            button.setCallbackData("kpi_sprintUser_" + sprint.getSprintNumber() 
                                   + "_" + userProjectID + "_" + projectID);

            keyboard.add(List.of(button));
        }

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    public InlineKeyboardMarkup inlineKPIUserList(List<UserProject> userProjects) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        for (UserProject userProject : userProjects) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            User user = userProject.getUser();
            String label = userProject.getRole() +
                            " (" + user.getFirstName() + 
                            " " + user.getLastName() +
                            ")";
            button.setText(label);
            button.setCallbackData("kpi_user_" + userProject.getID() + "_" + userProject.getProject().getID());

            keyboard.add(List.of(button));
        }

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