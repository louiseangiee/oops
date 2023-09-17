package com.oop.appa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Portfolio")
public class Portfolio {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="portfolio_id")
    private int id;

    @Column(name="user_id")
    private int user_id;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="total_capital")
    private double total_capital;

    // constructors
    public Portfolio(){
    }

    public Portfolio(int id, int user_id, String name, String description, double total_capital) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.description = description;
        this.total_capital = total_capital;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return user_id;
    }

    public void setUserId(int user_id) {
        this.user_id = user_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getTotalCapital() {
        return total_capital;
    }

    public void setTotalCapital(double total_capital) {
        this.total_capital = total_capital;
    }

    //define toString

    @Override
    public String toString(){
        return String.format("Portfolio [id=%d, user_id=%d, name=%s, description=%s, totalCapital=%.2f]", id, user_id, name, description, total_capital);
    }

    

}
