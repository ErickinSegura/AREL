package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface ProjectRepository extends JpaRepository<Project,Integer> {
    @Query("SELECT p.activeSprint FROM Project p WHERE p.id = :idProject")
    Integer findActiveSprintById(@Param("idProject") int idProject);
}
