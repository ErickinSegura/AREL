package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.LogsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface LogsRepository extends JpaRepository<LogsDTO, Integer> {

    @Query(value = "SELECT l.ID_LOG, " +
            "l.PROJECT_ID, " +
            "l.ACTION_LOG, " +
            "l.TIME_OF_LOG, " +
            "t.TITLE, " +
            "CASE " +
            "    WHEN l.USER_PROJECT IS NULL THEN 'Sistema' " +
            "    ELSE ut.FIRSTNAME " +
            "END AS FIRSTNAME " +
            "FROM TODOUSER.LOGS l " +
            "LEFT JOIN TODOUSER.TASK t " +
            "    ON l.TASK = t.ID_TASK " +
            "LEFT JOIN TODOUSER.USER_PROJECT up " +
            "    ON up.ID_USER_PROJECT = l.USER_PROJECT " +
            "LEFT JOIN TODOUSER.USER_TABLE ut " +
            "    ON up.ID_USER = ut.ID_USER " +
            "WHERE l.PROJECT_ID = :projectId " +
            "ORDER BY l.TIME_OF_LOG DESC " +
            "FETCH FIRST 10 ROWS ONLY",
            nativeQuery = true)
    List<LogsDTO> findTop10LogsByProjectId(@Param("projectId") int projectId);
}