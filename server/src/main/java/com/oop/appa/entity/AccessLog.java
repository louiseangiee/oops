package com.oop.appa.entity;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import jakarta.persistence.*;

@Entity
@Table(name="Access_Log")
public class AccessLog {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="log_id")
    private int logId;

    @Column(name="user_id")
    private int userId;

    @Column(name="action")
    private String action;

    @Column(name="timestamp")
    private Timestamp timestamp;

    // constructors
    public AccessLog(){
    }

    public AccessLog(int userId, String action, Timestamp timestamp) {
        this.userId = userId;
        this.action = action;
        this.timestamp = timestamp;
    }

    // getters and setters
    public int getId() {
        return logId;
    }

    public void setId(int id) {
        this.logId = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    // toString method
    @Override
    public String toString() {
        return "AccessLog [id=" + logId + ", userId=" + userId + ", action=" + action + ", timestamp=" + timestamp + "]";
    }
}
