package com.oop.appa.entity;

import jakarta.persistence.*;

import java.security.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.DETACH}, mappedBy="user")
    private List<AccessLog> accessLogs;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL)
    private List<Portfolio> portfolios;

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

    public List<AccessLog> getAccessLogs() {
        return accessLogs;
    }

    public void setAccessLogs(List<AccessLog> accessLogs) {
        this.accessLogs = accessLogs;
    }

    public List<Portfolio> getPortfolios() {
        return portfolios;
    }

    public void setPortfolios(List<Portfolio> portfolios) {
        this.portfolios = portfolios;
    }

    // add a convenience method
    public void addAccessLog(AccessLog accessLog) {

        if (accessLogs == null) {
            accessLogs = new ArrayList<>();
        }

        accessLogs.add(accessLog);
        accessLog.setUser(this);
    }

    public void addPortfolio(Portfolio portfolio) {
        if (portfolios == null) {
            portfolios = new ArrayList<>();
        }
        portfolios.add(portfolio);
        portfolio.setUser(this);
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
