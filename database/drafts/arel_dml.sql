-- Mock Data

INSERT INTO USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    PASSWORD
) VALUES ( 'Rodrigo',
           'Lopez',
           'rodrigo@example.com',
           'securepassword' );

INSERT INTO USER_TABLE (
    FIRSTNAME,
    LASTNAME,
    EMAIL,
    PASSWORD
) VALUES ( 'Erick',
           'Segura',
           'erick@example.com',
           'securepassword' );

INSERT INTO PROYECT (
    PROYECT_NAME,
    DESCRIPTION
) VALUES ( 'Simulación en Unity',
           'Proyecto de simulación de robots en un almacén utilizando Unity.' );

INSERT INTO PROYECT (
    PROYECT_NAME,
    DESCRIPTION
) VALUES ( 'Sistema de Control de Asistencia',
           'Desarrollo de un sistema para monitorear la asistencia de estudiantes y trabajadores.' );

INSERT INTO USER_PROYECT (
    ID_USER,
    ID_PROYECT,
    ROLE
) VALUES ( 1,
           1,
           'Manager' );

INSERT INTO USER_PROYECT (
    ID_USER,
    ID_PROYECT,
    ROLE
) VALUES ( 2,
           1,
           'Developer' );

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
) VALUES ( 'Category 1',
           1,
           2 );

INSERT INTO CATEGORY (
    CATEGORY_NAME,
    ID_PROYECT,
    ID_COLOR
) VALUES ( 'Category 2',
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
) VALUES ( 'Fix UI Bug',
           'There is a UI bug on the homepage.',
           2,
           1,
           1,
           1,
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
) VALUES ( 'Backend Optimization',
           'Optimize the database queries for faster performance.',
           1,
           2,
           2,
           2,
           2,
           1 );