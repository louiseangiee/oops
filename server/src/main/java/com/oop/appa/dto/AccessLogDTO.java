package com.oop.appa.dto;

import java.sql.Timestamp;

import com.oop.appa.entity.AccessLog;

public class AccessLogDTO {

    private Integer logId;
    private Integer user;
    private String action;
    private Timestamp timestamp;

    public AccessLogDTO() {}
    
    public AccessLogDTO(Integer logId, Integer user, String action, Timestamp timestamp) {
        this.logId = logId;
        this.user = user;
        this.action = action;
        this.timestamp = timestamp;
    }

    public AccessLogDTO (AccessLog accessLog) {
        logId = accessLog.getLogId();
        user = accessLog.getUser().getId();
        action = accessLog.getAction();
        timestamp = accessLog.getTimestamp();
    }
    

    public Integer getLogId() {
        return logId;
    }
    public void setLogId(Integer logId) {
        this.logId = logId;
    }
    public Integer getUserId() {
        return user;
    }
    public void setUser(Integer user) {
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

    

   
}

