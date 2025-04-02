-- Mock Data

INSERT INTO TODOUSER.USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    USER_LEVEL,
    TELEGRAMUSERNAME,
    PASSWORD
) VALUES ( 'Rodrigo',
           'Lopez',
           'rodrigo@arel.com',
           2,
           'roccolpz',
           'securepassword' );

INSERT INTO TODOUSER.USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    USER_LEVEL,
    TELEGRAMUSERNAME,
    PASSWORD
) VALUES ( 'Erick',
           'Segura',
           'erick@arel.com',
           1,
           'iPancrema',
           'securepassword' );

INSERT INTO TODOUSER.USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    USER_LEVEL,
    TELEGRAMUSERNAME,
    PASSWORD
) VALUES ( 'Emiliano',
           'Luna',
           'luna@arel.com',
           3,
           'luna.e',
           'securepassword' );

INSERT INTO TODOUSER.USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    USER_LEVEL,
    TELEGRAMUSERNAME,
    PASSWORD
) VALUES ( 'Alvaro',
           'Lozano',
           'alvaro@arel.com',
           2,
           'alvaritodiaz',
           'securepassword' );

INSERT INTO TODOUSER.PROJECT (
    PROJECT_NAME,
    DESCRIPTION
) VALUES ( 'Oracle Java Bot',
           'Development of a telegram bot to increase accountability and visibility for managers in software develompent projects with a web application portal.' );

INSERT INTO TODOUSER.PROJECT (
    PROJECT_NAME,
    DESCRIPTION
) VALUES ( 'AWAQ Gamification Software',
           'Game for biomonitor training for AWAQ organization, iykyk.' );

INSERT INTO TODOUSER.PROJECT (
    PROJECT_NAME,
    DESCRIPTION
) VALUES ( 'Papalote Museum Mobile App',
           'Development of a mobile software for Papalote Museum.');


INSERT INTO TODOUSER.USER_PROJECT (
    ID_USER,
    ID_PROJECT,
    ROLE
) VALUES ( 1,
           1,
           'Frontend Engineer');

INSERT INTO TODOUSER.USER_PROJECT (
    ID_USER,
    ID_PROJECT,
    ROLE
) VALUES ( 2,
           1,
           'SCRUM Master' );

INSERT INTO TODOUSER.USER_PROJECT (
    ID_USER,
    ID_PROJECT,
    ROLE
) VALUES ( 2,
           2,
           'SCRUM Master' );

INSERT INTO TODOUSER.USER_PROJECT (
    ID_USER,
    ID_PROJECT,
    ROLE
) VALUES ( 2,
           3,
           'SCRUM Master' );

INSERT INTO TODOUSER.USER_PROJECT (
    ID_USER,
    ID_PROJECT,
    ROLE
) VALUES ( 2,
           3,
           'SCRUM Master' );

INSERT INTO TODOUSER.USER_PROJECT (
    ID_USER,
    ID_PROJECT,
    ROLE
) VALUES ( 3,
           1,
           'Frontend Engineer' );

INSERT INTO TODOUSER.USER_PROJECT (
    ID_USER,
    ID_PROJECT,
    ROLE
) VALUES ( 4,
           1,
           'Backend Engineer' );

INSERT INTO TODOUSER.SPRINT (
    ID_PROJECT,
    SPRINT_NUMBER
) VALUES ( 1,
           1 );

INSERT INTO TODOUSER.SPRINT (
    ID_PROJECT,
    SPRINT_NUMBER
) VALUES ( 1,
           2 );

INSERT INTO TODOUSER.SPRINT (
    ID_PROJECT,
    SPRINT_NUMBER
) VALUES ( 1,
           3 );

INSERT INTO TODOUSER.SHORTCUT (
    ID_PROJECT,
    SHORTCUT_URL
) VALUES ( 1,
           'https://example.com/' );

INSERT INTO TODOUSER.SHORTCUT (
    ID_PROJECT,
    SHORTCUT_URL
) VALUES ( 1,
           'https://chihuahuaspin.com/' );

INSERT INTO TODOUSER.CATEGORY (
    CATEGORY_NAME,
    ID_PROJECT,
    ID_COLOR
) VALUES ( 'Web',
           1,
           2 );

INSERT INTO TODOUSER.CATEGORY (
    CATEGORY_NAME,
    ID_PROJECT,
    ID_COLOR
) VALUES ( 'Bot',
           1,
           1 );

INSERT INTO TODOUSER.TASK (
    TITLE,
    DESCRIPTION,
    TASK_STATE,
    ASSIGNED_TO,
    CATEGORY,
    SPRINT_ID,
    TASK_TYPE,
    TASK_PRIORITY
) VALUES ( 'Crear Cuenta',
           'Como usuario del portal, quiero poder crear una cuenta para acceder a la aplicación.',
           2,
           1,
           1,
           3,
           1,
           2 );

INSERT INTO TODOUSER.TASK (
    TITLE,
    DESCRIPTION,
    TASK_STATE,
    ASSIGNED_TO,
    CATEGORY,
    SPRINT_ID,
    TASK_TYPE,
    TASK_PRIORITY
) VALUES ( 'Arreglar bug responsividad',
           'La sidebar tapa el contenido de la vista en tamaño menor a 1000x1000',
           2,
           1,
           1,
           3,
           1,
           2 );

INSERT INTO TODOUSER.TASK (
    TITLE,
    DESCRIPTION,
    TASK_STATE,
    ASSIGNED_TO,
    CATEGORY,
    SPRINT_ID,
    TASK_TYPE,
    TASK_PRIORITY
) VALUES ( 'Sistema drag and drop',
           'Sistema para mover elementos en el tablero Kanban usando drag n drop',
           2,
           1,
           1,
           3,
           1,
           2 );

INSERT INTO TODOUSER.TASK (
    TITLE,
    DESCRIPTION,
    TASK_STATE,
    ASSIGNED_TO,
    CATEGORY,
    SPRINT_ID,
    TASK_TYPE,
    TASK_PRIORITY
) VALUES ( 'Implementar sistema de racha',
           'Sistema lógico de racha para portal web.',
           2,
           1,
           1,
           3,
           1,
           2 );

INSERT INTO TODOUSER.TASK (
    TITLE,
    DESCRIPTION,
    TASK_STATE,
    ASSIGNED_TO,
    CATEGORY,
    SPRINT_ID,
    TASK_TYPE,
    TASK_PRIORITY
) VALUES ( 'Inicio de Sesión',
           'Como usuario del portal, quiero poder iniciar sesión para acceder a la aplicación Criterios de Aceptación: Al ingresar las credenciales (email y password) y presionar el botón iniciar sesión, el usuario es transportado a su dashboard personal. Al iniciar sesión, solo tiene acceso a las vistas de su rol (dependerá nivel de privilegio, desarrollador, manager, administrador de software)',
           1,
           2,
           2,
           3,
           1,
           3 );

INSERT INTO TODOUSER.TASK (
    TITLE,
    DESCRIPTION,
    TASK_STATE,
    ASSIGNED_TO,
    CATEGORY,
    SPRINT_ID,
    TASK_TYPE,
    TASK_PRIORITY
) VALUES ( 'Vista Dashboard Manager',
           'Como manager, quiero poder acceder a una pantalla donde se muestren mis PROJECTos activos para acceder a información específica de algún PROJECTo. Criterios de Aceptación: La página muestra los PROJECTos activos con su nombre. Una descripción breve del PROJECTo. Un gráfico que muestre de manera general el avance y alguna notificación relevante de ese PROJECTo. Se muestran actividades programadas para hoy.',
           1,
           2,
           2,
           3,
           1,
           3 );