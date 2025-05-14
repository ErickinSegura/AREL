package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Logs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface LogsRepository extends JpaRepository<Logs, Integer> { // Especifica Logs e Integer
    List<Logs> findTop10ByProjectIdOrderByTimeOfLogDesc(int projectId); // Retorna una lista
}