package com.oop.appa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.security.Timestamp;
import java.util.Date;

@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int id;

    @Column(name = "email")
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "date_registered")
    private Date dateRegistered;

    @Column(name = "last_login_timestamp")
    private Timestamp lastLoginTimestamp;

    // constructors
    public User() {
    }

    public User(int id, String email, String passwordHash, Date dateRegistered, Timestamp lastLoginTimestamp) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.dateRegistered = dateRegistered;
        this.lastLoginTimestamp = lastLoginTimestamp;
    }

    // getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Date getDateRegistered() {
        return dateRegistered;
    }

    public void setDateRegistered(Date dateRegistered) {
        this.dateRegistered = dateRegistered;
    }

    public Timestamp getLastLoginTimestamp() {
        return lastLoginTimestamp;
    }

    public void setLastLoginTimestamp(Timestamp lastLoginTimestamp) {
        this.lastLoginTimestamp = lastLoginTimestamp;
    }

    // override toString
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email +
                ", passwordHash='" + passwordHash +
                ", dateRegistered=" + dateRegistered +
                ", lastLoginTimestamp=" + lastLoginTimestamp +
                '}';
    }

}
