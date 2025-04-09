package com.springboot.MyTodoList.util;
import java.util.ResourceBundle;

public enum BotMessages {

	BOT_REGISTERED_STARTED("bot.registered.started"),
	NO_PROJECT_ASSIGNED("no.project.assigned"),
	PROJECT_AVAILABLE("project.available"),
	MULTIPLE_PROJECTS_AVAILABLE("multiple.project.available"),
	TASK_UNAVAILABLE("task.unavailable"),
	WELCOME_MANAGER("welcome.manager"),
	DEV_OPEN_PROJECT("dev.open.project"),
	DEFAULT_MESSAGE_START("default.message.start"),
	COULDNT_GET_CATEGORY("couldnt.get.category"),
	DEFAULT_MESSAGE_STATE2("default.message.state2"),
	DISCONNECTING("disconnecting"),
	CREATE_TASK_ENTER_NAME("create.task.enter.name"),
	CREATE_TASK_ENTER_DESCRIPTION("create.task.enter.description"),
	CREATE_TASK_SET_CATEGORY("create.task.set.category"),
	CREATE_TASK_INACTIVE("create.task.inactive"),
	CREATE_TASK_SET_TYPE("create.task.set.type"),
	CREATE_TASK_PREVIEW("create.task.preview"),
	CREATE_TASK_SET_PRIORITY("create.task.set.priority"),
	CANCEL_TASK_CREATION("create.task.creation"),
	SAVE_TASK("save.task"),
	ERROR_DATABASE("error.database"),
	SENT_AGAIN_EXCEPTION("sent.again.exception"),
	LIST_SPRINT("list.sprint"),
	NO_ACTIVE_SPRINT("no.active.sprint"),
	ASSIGN_USER_TO_TASK("assign.user.to.task"),
	ASSIGNED_SUCCESSFULLY("assigned.successfully"),
	ESTIMATED_HOURS_ASSIGNED_SUCCESSFULLY("estimated.hours.assigned.successfully"),
	REAL_HOURS_ASSIGNED_SUCCESSFULLY("real.hours.assigned.successfully"),
	NO_ITEMS_IN_BACKLOG("no.items.in.backlog"),
	OPENED_BACKLOG("opened.backlog"),
	OPENED_SPRINTS("opened.sprints"),
	NO_SPRINTS_AVAILABLE("no.sprints.available"),
	OPENED_SPRINT("opened.sprint"),
	SUCCESSFULLY_MOVED_TO_BACKLOG("successfully.moved.to.backlog"),
	SUCCESFFULLY_MOVED_TO_CURRENT_SPRINT("successfully.moved.to.current.sprint"),
	SUCCESSFULLY_MOVED_TO_NEXT_SPRINT("successfully.moved.to.next.sprint"),
	ADDING_TO_NEXT_SPRINT("adding.to.next.sprint"),
	MOVING_TO_BACKLOG("moving.to.backlog"),
	ASK_CONFIRMATION_RUNNING_SPRINT("ask.confirmation.running.sprint"),
	ADDING_TO_CURRENT_SPRINT("adding.to.current.sprint"),
	CREATE_TASK_ENTER_ESTIMATEDHOURS("create.task.enter.estimatedhours")
	;

	private final String key;
	private static final ResourceBundle bundle = ResourceBundle.getBundle("botmessages");

	BotMessages(String key) {
		this.key = key;
	}

	public String getMessage(Object... args) {
		String message = bundle.getString(key);
		return String.format(message, args);
	}

}
