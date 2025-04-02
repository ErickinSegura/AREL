-- Mock Data

INSERT INTO USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    PASSWORD
) VALUES ( 'Rodrigo',
           'Lopez',
           'rodrigo@arel.com',
           'securepassword' );

INSERT INTO USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    PASSWORD
) VALUES ( 'Erick',
           'Segura',
           'erick@arel.com',
           'securepassword' );

INSERT INTO USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    PASSWORD
) VALUES ( 'Alvaro',
           'Lozano',
           'alvaro@arel.com',
           'securepassword' );

INSERT INTO USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    PASSWORD
) VALUES ( 'Emiliano',
           'Luna',
           'emiliano@arel.com',
           'securepassword' );

INSERT INTO PROYECT (
    PROYECT_NAME,
    DESCRIPTION
) VALUES ( 'Oracle Java Bot',
           'Development of a telegram bot to increase accountability and visibility for managers in software develompent projects with a web application portal.' );


INSERT INTO USER_PROYECT (
    ID_USER,
    ID_PROYECT,
    ROLE
) VALUES ( 1,
           1,
           'Product Owner' );

INSERT INTO USER_PROYECT (
    ID_USER,
    ID_PROYECT,
    ROLE
) VALUES ( 2,
           1,
           'SCRUM Master' );

INSERT INTO USER_PROYECT (
    ID_USER,
    ID_PROYECT,
    ROLE
) VALUES ( 3,
           1,
           'Frontend Engineer' );

INSERT INTO USER_PROYECT (
    ID_USER,
    ID_PROYECT,
    ROLE
) VALUES ( 4,
           1,
           'Backend Engineer' );

INSERT INTO SPRINT (
    ID_PROYECT,
    SPRINT_NUMBER
) VALUES ( 1,
           1 );

INSERT INTO SPRINT (
    ID_PROYECT,
    SPRINT_NUMBER
) VALUES ( 1,
           2 );

INSERT INTO SPRINT (
    ID_PROYECT,
    SPRINT_NUMBER
) VALUES ( 1,
           3 );

INSERT INTO SHORTCUT (
    ID_PROYECT,
    SHORTCUT_URL
) VALUES ( 1,
           'https://example.com/' );

INSERT INTO SHORTCUT (
    ID_PROYECT,
    SHORTCUT_URL
) VALUES ( 2,
           'https://chihuahuaspin.com/' );

INSERT INTO CATEGORY (
    CATEGORY_NAME,
    ID_PROYECT,
    ID_COLOR
) VALUES ( 'Web',
           1,
           2 );

INSERT INTO CATEGORY (
    CATEGORY_NAME,
    ID_PROYECT,
    ID_COLOR
) VALUES ( 'Bot',
           1,
           1 );

INSERT INTO TASK (
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

INSERT INTO TASK (
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

INSERT INTO TASK (
    TITLE,
    DESCRIPTION,
    TASK_STATE,
    ASSIGNED_TO,
    CATEGORY,
    SPRINT_ID,
    TASK_TYPE,
    TASK_PRIORITY
) VALUES ( 'Vista Dashboard Manager',
           'Como manager, quiero poder acceder a una pantalla donde se muestren mis proyectos activos para acceder a información específica de algún proyecto. Criterios de Aceptación: La página muestra los proyectos activos con su nombre. Una descripción breve del proyecto. Un gráfico que muestre de manera general el avance y alguna notificación relevante de ese proyecto. Se muestran actividades programadas para hoy.',
           1,
           2,
           2,
           3,
           1,
           3 );