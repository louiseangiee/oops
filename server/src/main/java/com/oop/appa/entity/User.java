package com.oop.appa.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Collection;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Users")
public class User implements UserDetails {

    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Getter
    @Column(name = "email")
    private String email;

    @Getter
    @Column(name = "fullName")
    private String fullName;

    @Column(name = "password")
    private String password;

    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH, CascadeType.DETACH}, mappedBy="user")
    private List<AccessLog> accessLogs;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Portfolio> portfolios;

    public User(Integer id, String email, String fullName, String password) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setAccessLogs(List<AccessLog> accessLogs) {
        this.accessLogs = accessLogs;
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
                ", fullName='" + fullName +
                ", password='" + password +
                '}';
    }

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
