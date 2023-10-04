package com.oop.appa.entity;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name="access_log")
public class AccessLog {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="log_id")
    private Integer logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    @JsonIgnore
    private User user;

    @Column(name="action")
    private String action;

    @Column(name="timestamp")
    private Timestamp timestamp;

    // constructors
    public AccessLog(){
    }

    public AccessLog(User user, String action, Timestamp timestamp) {
        this.user = user;
        this.action = action;
        this.timestamp = timestamp;
    }

    // getters and setters
    public Integer getLogId() {
        return logId;
    }

    public void setLogId(Integer logId) {
        this.logId = logId;
    }
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
        return "AccessLog [logId=" + logId + ", user=" + user.getId() + ", action=" + action + ", timestamp=" + timestamp + "]";
    }
    
}
