package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.Sprint;
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
public interface SprintRepository extends JpaRepository<Sprint,Integer> {
    
    @Query("SELECT s.id FROM Sprint s WHERE s.startDate <= CURRENT_TIMESTAMP AND s.endDate >= CURRENT_TIMESTAMP")
    List<Integer> findActiveSprintIds();

    @Query("SELECT s.project FROM Sprint s WHERE s.id = :id")
    List<Integer> findProjectByID(@Param("id") Integer id);
}
