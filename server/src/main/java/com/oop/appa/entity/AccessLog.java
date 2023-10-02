package com.oop.appa.entity;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.text.SimpleDateFormat;

@Entity
@Table(name="Access_Log")
public class AccessLog {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="log_id")
    private int id;

    @Column(name="user_id")
    private int user_id;

    @Column(name="action")
    private String action;


    @Column(name="timestamp")
    private Timestamp timestamp;

    // constructors
    public AccessLog(){
    }

    public AccessLog(int id, int user_id, String action, Timestamp timestamp) {
        this.id = id;
        this.user_id = user_id;
        this.action = action;
        this.timestamp = timestamp;
    }

    public int getId() {
        return id;
    }


    public void setId(int id) {
        this.id = id;
    }


    public int getUser_id() {
        return user_id;
    }


    public void setUser_id(int user_id) {
        this.user_id = user_id;
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


    

    //define toString
    @Override
        public String toString() {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            return String.format("Access_Log [id=%d, user_id=%d, action=%s, timestamp=%s]", id, user_id, action, sdf.format(timestamp));
        }
}
