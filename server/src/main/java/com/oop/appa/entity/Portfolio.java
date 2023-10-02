package com.oop.appa.entity;

import jakarta.persistence.*;

@Entity
@Table(name="Portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="portfolio_id")
    private int portfolioId;

    @Column(name="user_id")
    private int userId;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="total_capital")
    private double totalCapital;

    // constructors
    public Portfolio(){
    }

    public Portfolio(int userId, String name, String description, double totalCapital) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.totalCapital = totalCapital;
    }

    public int getPortfolioId() {
        return portfolioId;
    }

    public void setPortfolioId(int portfolioId) {
        this.portfolioId = portfolioId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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
        return totalCapital;
    }

    public void setTotalCapital(double totalCapital) {
        this.totalCapital = totalCapital;
    }

    @Override
    public String toString() {
        return "Portfolio [portfolioId=" + portfolioId + ", userId=" + userId + ", name=" + name + ", description="
                + description + ", totalCapital=" + totalCapital + "]";
    }

}
