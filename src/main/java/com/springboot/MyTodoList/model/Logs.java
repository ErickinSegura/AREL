package com.springboot.MyTodoList.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

/*
    representation of the LOGS table that exists already
    in the autonomous database
 */

@Entity
@Table(name = "LOGS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Logs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_LOG")
    private Integer id;

    @Column(name = "PROJECT_ID")
    private Integer projectId;

    @Column(name = "ACTION_LOG")
    private Integer actionLog;

    @Column(name = "USER_PROJECT")
    private Integer userProject;

    @Column(name = "TIME_OF_LOG")
    private String timeOfLog;

    @Column(name = "TASK")
    private Integer description;

    @Column(name = "SPRINT")
    private Integer sprint;

    public void setCurrentTime() {
        this.timeOfLog = LocalDateTime.now().toString();
    }
}