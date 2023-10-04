package com.oop.appa.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name="Portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="portfolio_id")
    private int portfolioId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="user_id")
    @JsonIgnore // modify later if we decide to implement admin can see everyone's portfolio and the posters or if certain portfolios can be public
    private User user;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="total_capital")
    private double totalCapital;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL)
    private List<PortfolioStock> portfolioStocks;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "portfolio_performance_id")
    private PerformanceMetrics performanceMetrics;

    // constructors
    public Portfolio(){
    }

    public Portfolio(User user, String name, String description, double totalCapital) {
        this.user = user;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

     public List<PortfolioStock> getPortfolioStocks() {
        return portfolioStocks;
    }

    public void setPortfolioStocks(List<PortfolioStock> portfolioStocks) {
        this.portfolioStocks = portfolioStocks;
    }

    public PerformanceMetrics getPerformanceMetrics() {
        return performanceMetrics;
    }

    public void setPerformanceMetrics(PerformanceMetrics performanceMetrics) {
        this.performanceMetrics = performanceMetrics;

        if (performanceMetrics != null) {
            performanceMetrics.setPortfolio(this);
        }
    }

    // add a convenience method
    public void addPortfolioStock(PortfolioStock portfolioStock) {

        if (portfolioStocks == null) {
            portfolioStocks = new ArrayList<>();
        }

        portfolioStocks.add(portfolioStock);
        portfolioStock.setPortfolio(this);
    }

    @Override
    public String toString() {
        return "Portfolio [portfolioId=" + portfolioId + ", name=" + name + ", description="
                + description + ", totalCapital=" + totalCapital + "]";
    }

}
