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
	DEFAULT_MESSAGE_STATE2("STATE2 Default Message, nacón...")
	;

	private String message;

	BotMessages(String enumMessage) {
		this.message = enumMessage;
	}

	public String getMessage(Object... args) {
		return String.format(message, args);
	}

}
