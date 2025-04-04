package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByTelegramUsername(String telegramUsername);
    Optional<User> findByEmail(String email);

    boolean existsByTelegramUsername(String telegramUsername);
    boolean existsByEmail(String email);
}
