package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.UserLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UserLevelRepository extends JpaRepository<UserLevel,Integer> {
    Optional<UserLevel> findByID(int ID);

}
