package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface ColorRepository extends JpaRepository<Color,Integer> {
}
