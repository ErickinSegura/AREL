package com.springboot.MyTodoList.util;

public enum BotMessages {
	
	HELLO_MYTODO_BOT(
	"Hello! I'm Rocco Naco tonto!\nType a new todo item below and press the send button (blue arrow), or select an option below:"),
	BOT_REGISTERED_STARTED("Bot registered and started succesfully!"),
	ITEM_DONE("Item done! Select /todolist to return to the list of todo items, or /start to go to the main screen."), 
	ITEM_UNDONE("Item undone! Select /todolist to return to the list of todo items, or /start to go to the main screen."), 
	ITEM_DELETED("Item deleted! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	TYPE_NEW_TODO_ITEM("Type a new todo item below and press the send button (blue arrow) on the rigth-hand side."),
	NEW_ITEM_ADDED("New item added! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	BYE("Bye! Select /start to resume!"),
	NO_PROJECT_ASSIGNED("Welcome, %s, there are no project assigned to you right now."),
	PROJECT_AVAILABLE("%s, you are assigned to the project \"%s\" as %s. Here's your active tasks, please select one option to see/update its information."),
	MULTIPLE_PROJECTS_AVAILABLE("%s, you have multiple projects available, please select one below."),
	TASK_UNAVAILABLE("There was a problem getting this task's information, try again later."),
	WELCOME_MANAGER("Welcome, %s. Select the project you want to manage."),
	DEV_OPEN_PROJECT("Opening project \"%s\", you are asigned as %s. Here's your active tasks, please select one option to see/update its information."),
	DEFAULT_MESSAGE_START("I'm sorry, I didn't understand."),
	COULDNT_GET_CATEGORY("There was a mistake retrieving the information for this category, setting null by default."),
	DEFAULT_MESSAGE_STATE2("STATE2 Default Message, nacón..."),
	DISCONNECTING("You've been inactive for too long, ending chat."),
	CREATE_TASK_ENTER_NAME("Please enter the name of your new ticket:"),
	CREATE_TASK_ENTER_DESCRIPTION("Now, enter the description for this ticket:"),
	CREATE_TASK_SET_CATEGORY("Which category best fits this ticket?"),
	CREATE_TASK_INACTIVE("You've been inactive for too long, please start again."),
	CREATE_TASK_SET_TYPE("Please select the type that best fits this ticket."),
	CREATE_TASK_PREVIEW("Excelent! Now confirm that the information below is correct:\n\n%s"),
	CREATE_TASK_SET_PRIORITY("Now, enter the priority for this ticket:"),
	CANCEL_TASK_CREATION("Cancelling creation (TODO: EDIT, NOT CANCEL)"),
	SAVE_TASK("Task was saved successfully in this project's backlog. Need something else? Please /start again."),
	ERROR_DATABASE("There was an error reaching this information, please try again later."),
	SENT_AGAIN_EXCEPTION("You've already sent this ticket."),
	LIST_SPRINT("Here's the list of tasks assigned to this sprint, click one to see it's information."),
	NO_ACTIVE_SPRINT("The is no active sprint."),
	ASSIGN_USER_TO_TASK("Select someone to assign this task to."),
	ASSIGNED_SUCCESSFULLY("Task assigned successfully.")
	;

	private String message;

	BotMessages(String enumMessage) {
		this.message = enumMessage;
	}

	public String getMessage(Object... args) {
		return String.format(message, args);
	}

}
