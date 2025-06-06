--#region App Triggers
CREATE OR REPLACE TRIGGER TRIGGER_LOG_COMPLETED_TASK
AFTER UPDATE OF TASK_STATE ON TODOUSER.TASK
FOR EACH ROW
WHEN (NEW.TASK_STATE = 3 AND OLD.TASK_STATE != 3)
BEGIN
    INSERT INTO TODOUSER.LOGS (PROJECT_ID, ACTION_LOG, USER_PROJECT, TASK)
    VALUES (
        :NEW.PROJECT_ID,
        1,
        :NEW.ASSIGNED_TO,
        :NEW.ID_TASK
    );
END;
/

CREATE OR REPLACE TRIGGER TRIGGER_LOG_DOING_TASK
AFTER UPDATE OF TASK_STATE ON TODOUSER.TASK
FOR EACH ROW
WHEN (NEW.TASK_STATE = 2 AND OLD.TASK_STATE != 2)
BEGIN
    INSERT INTO TODOUSER.LOGS (PROJECT_ID, ACTION_LOG, USER_PROJECT, TASK)
    VALUES (
        :NEW.PROJECT_ID,
        2,
        :NEW.ASSIGNED_TO,
        :NEW.ID_TASK
    );
END;
/

CREATE OR REPLACE TRIGGER TRIGGER_LOG_CREATED_TASK
AFTER INSERT ON TODOUSER.TASK
FOR EACH ROW
BEGIN
    INSERT INTO TODOUSER.LOGS (PROJECT_ID, ACTION_LOG, USER_PROJECT, TASK)
    VALUES (
        :NEW.PROJECT_ID,
        3,
        :NEW.ASSIGNED_TO,
        :NEW.ID_TASK
    );
END;
/

CREATE OR REPLACE TRIGGER TRIGGER_LOG_NEW_SPRINT
AFTER UPDATE OF ACTIVE_SPRINT ON TODOUSER.PROJECT
FOR EACH ROW
BEGIN
    INSERT INTO TODOUSER.LOGS (PROJECT_ID, ACTION_LOG, SPRINT)
    VALUES (
        :NEW.ID_PROJECT,
        4,
        :NEW.ACTIVE_SPRINT
    );
END;
/

CREATE OR REPLACE TRIGGER TRIGGER_SET_SPRINT_NUMBER
BEFORE INSERT ON TODOUSER.SPRINT
FOR EACH ROW
DECLARE
    v_max_sprint_number NUMBER;
BEGIN
    SELECT COALESCE(MAX(s.sprint_number), 0) + 1
    INTO v_max_sprint_number
    FROM TODOUSER.SPRINT s
    WHERE s.ID_PROJECT = :NEW.ID_PROJECT;

    :NEW.SPRINT_NUMBER := v_max_sprint_number;
END;
/


--#region App Error Triggers
CREATE OR REPLACE TRIGGER TRIGGER_START_END_DATES
AFTER INSERT ON TODOUSER.SPRINT
FOR EACH ROW
BEGIN
IF :NEW.end_date < :NEW.start_date THEN
RAISE_APPLICATION_ERROR(-20006, 'La fecha de fin no puede ser anterior a la fecha de inicio.');
END IF;
END;
/

CREATE OR REPLACE TRIGGER TRIGGER_END_DATE
AFTER INSERT ON TODOUSER.SPRINT
FOR EACH ROW
BEGIN
IF CURRENT_TIMESTAMP > :NEW.END_DATE THEN
RAISE_APPLICATION_ERROR(-20005, 'La fecha de fin no puede ser anterior a la fecha actual.');
END IF;
END;
/

CREATE OR REPLACE TRIGGER TRIGGER_LIMIT_PROJECTS_PER_MANAGER
BEFORE INSERT ON TODOUSER.USER_PROJECT
FOR EACH ROW
DECLARE
v_user_level NUMBER;
v_project_count NUMBER;
BEGIN
-- Obtener el nivel del usuario
SELECT USER_LEVEL
INTO v_user_level
FROM TODOUSER.USER_TABLE
WHERE ID_USER = :NEW.ID_USER;

IF v_user_level = 1 THEN
    SELECT COUNT(*)
    INTO v_project_count
    FROM TODOUSER.USER_PROJECT
    WHERE ID_USER = :NEW.ID_USER;

    IF v_project_count >= 7 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Un manager solo puede estar asignado a 7 distintos proyectos.');
    END IF;
END IF;
END;
/

CREATE OR REPLACE TRIGGER TRIGGER_UNIQUE_PROJECT_FOR_DEVELOPER
BEFORE INSERT ON TODOUSER.USER_PROJECT
FOR EACH ROW
DECLARE
v_user_level NUMBER;
v_project_count NUMBER;
BEGIN
-- Obtener el nivel del usuario
SELECT USER_LEVEL
INTO v_user_level
FROM TODOUSER.USER_TABLE
WHERE ID_USER = :NEW.ID_USER;

IF v_user_level = 2 THEN
    SELECT COUNT(*)
    INTO v_project_count
    FROM TODOUSER.USER_PROJECT
    WHERE ID_USER = :NEW.ID_USER;

    IF v_project_count >= 1 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Un developer solo puede estar asignado a un único proyecto.');
    END IF;
END IF;
END;
/
