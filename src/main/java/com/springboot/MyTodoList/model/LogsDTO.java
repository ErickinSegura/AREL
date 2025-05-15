package com.springboot.MyTodoList.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "LOGS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogsDTO {
    @Id
    @Column(name = "ID_LOG")
    private Integer idLog;

    @Column(name = "PROJECT_ID")
    private Integer projectId;

    @Column(name = "ACTION_LOG")
    private Integer actionLog;

    @Column(name = "TIME_OF_LOG")
    private String timeOfLog;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "FIRSTNAME")
    private String firstname;
}