package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.UserProject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UserProjectRepository extends JpaRepository<UserProject,Integer> {
    List<UserProject> findByProjectId(int projectId);
    List<UserProject> findByUserId(int userId);

    Optional<UserProject> findByUserIdAndProjectId(int userId, int projectId);
}
