package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.SprintOverview;
import com.springboot.MyTodoList.model.UserPerformance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class OverviewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<SprintOverview> getSprintOverviews() {
        String sql = "SELECT " +
                "p.PROJECT_NAME, " +
                "p.ID_PROJECT, " +
                "s.SPRINT_NUMBER, " +
                "s.START_DATE, " +
                "s.END_DATE, " +
                "COUNT(t.ID_TASK) AS TOTAL_TASKS, " +
                "SUM(CASE WHEN t.TASK_STATE = 3 THEN 1 ELSE 0 END) AS COMPLETED_TASKS, " +
                "SUM(CASE WHEN t.TASK_STATE = 3 THEN t.REAL_HOURS ELSE 0 END) AS HOURS_SPENT_ON_COMPLETED, " +
                "SUM(t.ESTIMATED_HOURS) AS TOTAL_ESTIMATED_HOURS, " +
                "SUM(t.REAL_HOURS) AS TOTAL_REAL_HOURS " +
                "FROM " +
                "TODOUSER.SPRINT s " +
                "JOIN " +
                "TODOUSER.PROJECT p ON s.ID_PROJECT = p.ID_PROJECT " +
                "LEFT JOIN " +
                "TODOUSER.TASK t ON t.SPRINT_ID = s.ID_SPRINT " +
                "WHERE " +
                "t.DELETED = 0 OR t.DELETED IS NULL " +
                "GROUP BY " +
                "p.PROJECT_NAME, p.ID_PROJECT, s.SPRINT_NUMBER, s.START_DATE, s.END_DATE " +
                "ORDER BY " +
                "p.PROJECT_NAME, s.SPRINT_NUMBER";

        return jdbcTemplate.query(sql, new SprintOverviewRowMapper());
    }

    public List<SprintOverview> getSprintOverviewsByProjectId(Long projectId) {
        String sql = "SELECT " +
                "p.PROJECT_NAME, " +
                "p.ID_PROJECT, " +
                "s.SPRINT_NUMBER, " +
                "s.START_DATE, " +
                "s.END_DATE, " +
                "COUNT(t.ID_TASK) AS TOTAL_TASKS, " +
                "SUM(CASE WHEN t.TASK_STATE = 3 THEN 1 ELSE 0 END) AS COMPLETED_TASKS, " +
                "SUM(CASE WHEN t.TASK_STATE = 3 THEN t.REAL_HOURS ELSE 0 END) AS HOURS_SPENT_ON_COMPLETED, " +
                "SUM(t.ESTIMATED_HOURS) AS TOTAL_ESTIMATED_HOURS, " +
                "SUM(t.REAL_HOURS) AS TOTAL_REAL_HOURS " +
                "FROM " +
                "TODOUSER.SPRINT s " +
                "JOIN " +
                "TODOUSER.PROJECT p ON s.ID_PROJECT = p.ID_PROJECT " +
                "LEFT JOIN " +
                "TODOUSER.TASK t ON t.SPRINT_ID = s.ID_SPRINT " +
                "WHERE " +
                "(t.DELETED = 0 OR t.DELETED IS NULL) " +
                "AND p.ID_PROJECT = ? " +
                "GROUP BY " +
                "p.PROJECT_NAME, p.ID_PROJECT, s.SPRINT_NUMBER, s.START_DATE, s.END_DATE " +
                "ORDER BY " +
                "s.SPRINT_NUMBER";

        return jdbcTemplate.query(sql, new SprintOverviewRowMapper(), projectId);
    }

    public List<UserPerformance> getUserPerformances() {
        String sql = "SELECT " +
                "p.PROJECT_NAME, " +
                "p.ID_PROJECT, " +
                "s.SPRINT_NUMBER, " +
                "u.FIRSTNAME || ' ' || u.LASTNAME AS USER_NAME, " +
                "COUNT(t.ID_TASK) AS ASSIGNED_TASKS, " +
                "SUM(CASE WHEN t.TASK_STATE = 3 THEN 1 ELSE 0 END) AS COMPLETED_TASKS, " +
                "ROUND(SUM(CASE WHEN t.TASK_STATE = 3 THEN 1 ELSE 0 END) * 100.0 / " +
                "CASE WHEN COUNT(t.ID_TASK) = 0 THEN 1 ELSE COUNT(t.ID_TASK) END, 2) AS COMPLETION_RATE, " +
                "SUM(t.ESTIMATED_HOURS) AS TOTAL_ESTIMATED_HOURS, " +
                "SUM(t.REAL_HOURS) AS TOTAL_REAL_HOURS " +
                "FROM " +
                "TODOUSER.USER_TABLE u " +
                "JOIN " +
                "TODOUSER.USER_PROJECT up ON u.ID_USER = up.ID_USER " +
                "JOIN " +
                "TODOUSER.PROJECT p ON up.ID_PROJECT = p.ID_PROJECT " +
                "JOIN " +
                "TODOUSER.SPRINT s ON s.ID_PROJECT = p.ID_PROJECT " +
                "LEFT JOIN " +
                "TODOUSER.TASK t ON t.SPRINT_ID = s.ID_SPRINT AND t.ASSIGNED_TO = up.ID_USER_PROJECT " +
                "WHERE " +
                "t.DELETED = 0 OR t.DELETED IS NULL " +
                "GROUP BY " +
                "p.PROJECT_NAME, p.ID_PROJECT, s.SPRINT_NUMBER, u.FIRSTNAME, u.LASTNAME " +
                "ORDER BY " +
                "p.PROJECT_NAME, s.SPRINT_NUMBER, COMPLETION_RATE DESC";

        return jdbcTemplate.query(sql, new UserPerformanceRowMapper());
    }

    public List<UserPerformance> getUserPerformancesByProjectId(Long projectId) {
        String sql = "SELECT " +
                "p.PROJECT_NAME, " +
                "p.ID_PROJECT, " +
                "s.SPRINT_NUMBER, " +
                "u.FIRSTNAME || ' ' || u.LASTNAME AS USER_NAME, " +
                "COUNT(t.ID_TASK) AS ASSIGNED_TASKS, " +
                "SUM(CASE WHEN t.TASK_STATE = 3 THEN 1 ELSE 0 END) AS COMPLETED_TASKS, " +
                "ROUND(SUM(CASE WHEN t.TASK_STATE = 3 THEN 1 ELSE 0 END) * 100.0 / CASE " +
                "WHEN COUNT(t.ID_TASK) = 0 THEN 1 ELSE COUNT(t.ID_TASK) END, 2) AS COMPLETION_RATE, " +
                "SUM(t.ESTIMATED_HOURS) AS TOTAL_ESTIMATED_HOURS, " +
                "SUM(t.REAL_HOURS) AS TOTAL_REAL_HOURS " +
                "FROM " +
                "TODOUSER.USER_TABLE u " +
                "JOIN " +
                "TODOUSER.USER_PROJECT up ON u.ID_USER = up.ID_USER " +
                "JOIN " +
                "TODOUSER.PROJECT p ON up.ID_PROJECT = p.ID_PROJECT " +
                "JOIN " +
                "TODOUSER.SPRINT s ON s.ID_PROJECT = p.ID_PROJECT " +
                "LEFT JOIN " +
                "TODOUSER.TASK t ON t.SPRINT_ID = s.ID_SPRINT AND t.ASSIGNED_TO = up.ID_USER_PROJECT " +
                "WHERE " +
                "(t.DELETED = 0 OR t.DELETED IS NULL) " +
                "AND p.ID_PROJECT = ? " +
                "GROUP BY " +
                "p.PROJECT_NAME, p.ID_PROJECT, s.SPRINT_NUMBER, u.FIRSTNAME, u.LASTNAME " +
                "ORDER BY " +
                "s.SPRINT_NUMBER, COMPLETION_RATE DESC";

        return jdbcTemplate.query(sql, new UserPerformanceRowMapper(), projectId);
    }

    public List<UserPerformance> getUserPerformanceByProjectIdAndUserId(Long projectId, Long userId) {
        String sql = "SELECT " +
                "p.PROJECT_NAME, " +
                "p.ID_PROJECT, " +
                "s.SPRINT_NUMBER, " +
                "u.FIRSTNAME || ' ' || u.LASTNAME AS USER_NAME, " +
                "COUNT(t.ID_TASK) AS ASSIGNED_TASKS, " +
                "SUM(CASE WHEN t.TASK_STATE = 3 THEN 1 ELSE 0 END) AS COMPLETED_TASKS, " +
                "ROUND(SUM(CASE WHEN t.TASK_STATE = 3 THEN 1 ELSE 0 END) * 100.0 / CASE " +
                "WHEN COUNT(t.ID_TASK) = 0 THEN 1 ELSE COUNT(t.ID_TASK) END, 2) AS COMPLETION_RATE, " +
                "SUM(t.ESTIMATED_HOURS) AS TOTAL_ESTIMATED_HOURS, " +
                "SUM(t.REAL_HOURS) AS TOTAL_REAL_HOURS " +
                "FROM " +
                "TODOUSER.USER_TABLE u " +
                "JOIN " +
                "TODOUSER.USER_PROJECT up ON u.ID_USER = up.ID_USER " +
                "JOIN " +
                "TODOUSER.PROJECT p ON up.ID_PROJECT = p.ID_PROJECT " +
                "JOIN " +
                "TODOUSER.SPRINT s ON s.ID_PROJECT = p.ID_PROJECT " +
                "LEFT JOIN " +
                "TODOUSER.TASK t ON t.SPRINT_ID = s.ID_SPRINT AND t.ASSIGNED_TO = up.ID_USER_PROJECT " +
                "WHERE " +
                "(t.DELETED = 0 OR t.DELETED IS NULL) " +
                "AND p.ID_PROJECT = ? " +
                "AND u.ID_USER = ? " +
                "GROUP BY " +
                "p.PROJECT_NAME, p.ID_PROJECT, s.SPRINT_NUMBER, u.FIRSTNAME, u.LASTNAME " +
                "ORDER BY " +
                "s.SPRINT_NUMBER";

        return jdbcTemplate.query(sql, new UserPerformanceRowMapper(), projectId, userId);
    }

    private static class SprintOverviewRowMapper implements RowMapper<SprintOverview> {
        @Override
        public SprintOverview mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new SprintOverview(
                    rs.getString("PROJECT_NAME"),
                    rs.getLong("ID_PROJECT"),
                    rs.getInt("SPRINT_NUMBER"),
                    rs.getObject("START_DATE", LocalDateTime.class),
                    rs.getObject("END_DATE", LocalDateTime.class),
                    rs.getInt("TOTAL_TASKS"),
                    rs.getInt("COMPLETED_TASKS"),
                    rs.getInt("HOURS_SPENT_ON_COMPLETED"),
                    rs.getInt("TOTAL_ESTIMATED_HOURS"),
                    rs.getInt("TOTAL_REAL_HOURS")
            );
        }
    }

    private static class UserPerformanceRowMapper implements RowMapper<UserPerformance> {
        @Override
        public UserPerformance mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new UserPerformance(
                    rs.getString("PROJECT_NAME"),
                    rs.getLong("ID_PROJECT"),
                    rs.getInt("SPRINT_NUMBER"),
                    rs.getString("USER_NAME"),
                    rs.getInt("ASSIGNED_TASKS"),
                    rs.getInt("COMPLETED_TASKS"),
                    rs.getDouble("COMPLETION_RATE"),
                    rs.getInt("TOTAL_ESTIMATED_HOURS"),
                    rs.getInt("TOTAL_REAL_HOURS")
            );
        }
    }
}