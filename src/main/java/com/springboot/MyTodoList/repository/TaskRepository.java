package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.List;

import javax.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface TaskRepository extends JpaRepository<Task,Integer> {
    List<Task> findByAssignedToId(int assignedToId);

    List<Task> findBySprint(int sprintId);

    @Query("select s from Task s where s.sprint is null and s.projectId = :projectId")
    List<Task> getBacklogTasks(@Param("projectId") Integer projectId);
}
