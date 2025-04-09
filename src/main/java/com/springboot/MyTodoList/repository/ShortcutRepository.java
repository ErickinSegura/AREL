package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.Shortcut;
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
public interface ShortcutRepository extends JpaRepository<Shortcut, Integer> {
    @Query("select s from Shortcut s where s.project = :project")
    List<Shortcut> findByProjectId(@Param("project") Integer project);
}