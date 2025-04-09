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
    
    @Query(
        "SELECT s.ID " +
        "FROM Sprint s " +
        "WHERE s.project = :idProject " +
        "AND s.startDate <= CURRENT_TIMESTAMP " +
        "AND s.endDate >= CURRENT_TIMESTAMP"
    )
    List<Integer> findActiveSprintIds(@Param("idProject") Integer idProject);

    @Query(
        "SELECT s.project " +
        "FROM Sprint s " +
        "WHERE s.id = :id"
    )
    List<Integer> findProjectByID(@Param("id") Integer id);

    @Query(
        "SELECT s " +
        "FROM Sprint s " +
        "WHERE CURRENT_TIMESTAMP < s.endDate " +
        "AND s.project = :idProject " +
        "ORDER BY s.sprintNumber"
    )
    List<Sprint> availableSprints(@Param("idProject") Integer idProject);

    @Query(
        "SELECT s " +
        "FROM Sprint s " +
        "WHERE s.startDate > CURRENT_TIMESTAMP " +
        "AND s.project = :idProject " +
        "ORDER BY s.startDate ASC"
    )
    List<Sprint> getNextSprint(@Param("idProject") Integer idProject);
}
