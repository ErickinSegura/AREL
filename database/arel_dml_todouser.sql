-- Mock Data

INSERT INTO TODOUSER.COLOR ( HEX_COLOR ) VALUES ( '4984B8' );
INSERT INTO TODOUSER.COLOR ( HEX_COLOR ) VALUES ( '2E6F40' );

INSERT INTO TODOUSER.ICON ( ICON_NAME ) VALUES ( 'icon-name-1' );
INSERT INTO TODOUSER.ICON ( ICON_NAME ) VALUES ( 'icon-name-2' );

Insert into TODOUSER.LOG_ACTION (LABEL) values ('COMPLETED TASK');
Insert into TODOUSER.LOG_ACTION (LABEL) values ('DOING TASK');
Insert into TODOUSER.LOG_ACTION (LABEL) values ('CREATED TASK');,

Insert into TODOUSER.USER_TABLE (ID_USER,FIRSTNAME,LASTNAME,EMAIL,USER_LEVEL,TELEGRAMUSERNAME,PASSWORD,LAST_SEEN,CREATED) values (1,'Rocco','Lopez','rocco@arel.com',2,'roccolpz','$2a$10$jX.YLDUhMEvGXVQydR78C.q4rm6jrZzUK0s386rPC8d5oWeis74Xe',null,null);
Insert into TODOUSER.USER_TABLE (ID_USER,FIRSTNAME,LASTNAME,EMAIL,USER_LEVEL,TELEGRAMUSERNAME,PASSWORD,LAST_SEEN,CREATED) values (2,'Erick','Segura','erick@arel.com',3,'iPancrema','$2a$10$jX.YLDUhMEvGXVQydR78C.q4rm6jrZzUK0s386rPC8d5oWeis74Xe',null,null);
Insert into TODOUSER.USER_TABLE (ID_USER,FIRSTNAME,LASTNAME,EMAIL,USER_LEVEL,TELEGRAMUSERNAME,PASSWORD,LAST_SEEN,CREATED) values (3,'Emiliano','Luna','luna@arel.com',2,'luna.e','$2a$10$jX.YLDUhMEvGXVQydR78C.q4rm6jrZzUK0s386rPC8d5oWeis74Xe',null,null);
Insert into TODOUSER.USER_TABLE (ID_USER,FIRSTNAME,LASTNAME,EMAIL,USER_LEVEL,TELEGRAMUSERNAME,PASSWORD,LAST_SEEN,CREATED) values (4,'Alvaro','Lozano','alvaro@arel.com',2,'alvaritodiaz','$2a$10$jX.YLDUhMEvGXVQydR78C.q4rm6jrZzUK0s386rPC8d5oWeis74Xe',null,null);

Insert into TODOUSER.PROJECT (ID_PROJECT,PROJECT_NAME,ID_COLOR,ID_ICON,ACTIVE_SPRINT) values (1,'Oracle Java Bot',1,null,2);
Insert into TODOUSER.PROJECT (ID_PROJECT,PROJECT_NAME,ID_COLOR,ID_ICON,ACTIVE_SPRINT) values (2,'AWAQ Gamification Software',2,null,null);
Insert into TODOUSER.PROJECT (ID_PROJECT,PROJECT_NAME,ID_COLOR,ID_ICON,ACTIVE_SPRINT) values (3,'Papalote Museum Mobile App',null,null,null);

Insert into TODOUSER.USER_PROJECT (ID_USER_PROJECT,ID_USER,ID_PROJECT,ROLE) values (1,1,1,'Frontend Engineer');
Insert into TODOUSER.USER_PROJECT (ID_USER_PROJECT,ID_USER,ID_PROJECT,ROLE) values (2,2,1,'SCRUM Master');
Insert into TODOUSER.USER_PROJECT (ID_USER_PROJECT,ID_USER,ID_PROJECT,ROLE) values (3,3,1,'Product Owner');
Insert into TODOUSER.USER_PROJECT (ID_USER_PROJECT,ID_USER,ID_PROJECT,ROLE) values (4,4,1,'Backend Engineer');

Insert into TODOUSER.SPRINT (ID_SPRINT,ID_PROJECT,SPRINT_NUMBER,START_DATE,END_DATE) values (1,1,1,to_timestamp('02/04/25 17:42:23.324643000','DD/MM/RR HH24:MI:SSXFF'),to_timestamp('09/04/25 17:41:23.324643000','DD/MM/RR HH24:MI:SSXFF'));
Insert into TODOUSER.SPRINT (ID_SPRINT,ID_PROJECT,SPRINT_NUMBER,START_DATE,END_DATE) values (2,1,2,to_timestamp('10/04/25 17:42:23.324643000','DD/MM/RR HH24:MI:SSXFF'),to_timestamp('17/04/25 17:41:23.324643000','DD/MM/RR HH24:MI:SSXFF'));
Insert into TODOUSER.SPRINT (ID_SPRINT,ID_PROJECT,SPRINT_NUMBER,START_DATE,END_DATE) values (3,1,3,to_timestamp('18/04/25 17:42:23.324643000','DD/MM/RR HH24:MI:SSXFF'),to_timestamp('24/04/25 17:41:23.324643000','DD/MM/RR HH24:MI:SSXFF'));
Insert into TODOUSER.SPRINT (ID_SPRINT,ID_PROJECT,SPRINT_NUMBER,START_DATE,END_DATE) values (4,1,4,to_timestamp('24/04/25 17:42:23.324643000','DD/MM/RR HH24:MI:SSXFF'),to_timestamp('30/04/25 17:41:23.324643000','DD/MM/RR HH24:MI:SSXFF'));

Insert into TODOUSER.SHORTCUT (ID_SHORTCUT,ID_PROJECT,SHORTCUT_URL) values (1,1,'https://example.com/');
Insert into TODOUSER.SHORTCUT (ID_SHORTCUT,ID_PROJECT,SHORTCUT_URL) values (2,1,'https://chihuahuaspin.com/');

Insert into TODOUSER.CATEGORY (ID_CATEGORY,CATEGORY_NAME,ID_PROJECT,ID_COLOR) values (1,'Web',1,2);
Insert into TODOUSER.CATEGORY (ID_CATEGORY,CATEGORY_NAME,ID_PROJECT,ID_COLOR) values (2,'Bot',1,1);

Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('B-12 Sesiones de Telegram',3,to_timestamp('02/04/25 07:01:53.674184000','DD/MM/RR HH24:MI:SSXFF'),4,4,1,2,null,1,4,4,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('W-12 Backend de Shortcuts',3,to_timestamp('02/04/25 07:05:20.574230000','DD/MM/RR HH24:MI:SSXFF'),2,2,4,1,null,1,4,2,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('I-01 Investigación IA',3,to_timestamp('02/04/25 07:06:30.685444000','DD/MM/RR HH24:MI:SSXFF'),4,3,3,1,null,1,4,1,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('W-03 Cerrar Sesión',3,to_timestamp('02/04/25 07:03:25.592659000','DD/MM/RR HH24:MI:SSXFF'),1,1,2,1,null,1,4,1,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('B-08 Creación de Tareas',3,to_timestamp('02/04/25 07:21:51.903917000','DD/MM/RR HH24:MI:SSXFF'),2,2,1,2,2,1,4,3,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('W-15 Frontend Settings',3,to_timestamp('02/04/25 07:21:54.498372000','DD/MM/RR HH24:MI:SSXFF'),2,2,3,1,2,1,4,2,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('W-04 Crear Cuenta Frontend',3,to_timestamp('02/04/25 07:21:57.193153000','DD/MM/RR HH24:MI:SSXFF'),2,2,2,1,2,1,4,3,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('W-05 Inicio de Sesión Frontend',3,to_timestamp('02/04/25 07:21:59.929837000','DD/MM/RR HH24:MI:SSXFF'),2,4,2,1,2,1,4,3,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('B-10 Cambio de estado de una tarea',3,to_timestamp('02/04/25 07:22:03.237712000','DD/MM/RR HH24:MI:SSXFF'),1,1,1,2,2,1,4,3,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('W-16 Primera Implementación de PU',2,to_timestamp('02/04/25 07:25:42.105007000','DD/MM/RR HH24:MI:SSXFF'),4,null,4,1,2,1,4,2,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('B-11 Creación de Sprints',3,to_timestamp('02/04/25 07:22:05.871813000','DD/MM/RR HH24:MI:SSXFF'),4,3,1,2,2,1,4,3,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('W-01 Crear Cuenta Backend',3,to_timestamp('02/04/25 18:19:19.188873000','DD/MM/RR HH24:MI:SSXFF'),4,3,2,1,null,1,4,3,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('Frontend Popup',1,to_timestamp('03/04/25 14:42:38.095710000','DD/MM/RR HH24:MI:SSXFF'),4,3,1,1,2,1,4,2,0);
Insert into TODOUSER.TASK (TITLE,TASK_STATE,CREATION_DATE,ESTIMATED_HOURS,REAL_HOURS,ASSIGNED_TO,CATEGORY,SPRINT_ID,PROJECT_ID,TASK_TYPE,TASK_PRIORITY,DELETED) values ('W-02 Inicio de Sesión Frontend',3,to_timestamp('02/04/25 18:19:19.202778000','DD/MM/RR HH24:MI:SSXFF'),2,2,2,1,null,1,4,3,0);

--Insert into TODOUSER.LOGS (PROJECT_ID, ACTION_LOG, USER_PROJECT) values ()