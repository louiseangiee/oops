package com.oop.appa.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name="portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="portfolio_id")
    private Integer portfolioId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name="user_id")
    //@JsonIgnore 
    @JsonBackReference
    private User user;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="total_capital")
    private double totalCapital;

    @Column(name = "remaining_capital")
    private double remainingCapital;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "portfolio-portfoliostock")
    private List<PortfolioStock> portfolioStocks;

    // constructors
    public Portfolio(){
    }

    public Portfolio(User user, String name, String description, double totalCapital, double remainingCapital) {
        this.user = user;
        this.name = name;
        this.description = description;
        this.totalCapital = totalCapital;
        this.remainingCapital = remainingCapital;
    }

    public Integer getPortfolioId() {
        return portfolioId;
    }

    public void setPortfolioId(Integer portfolioId) {
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

    public double getRemainingCapital() {
        return remainingCapital;
    }

    public void setRemainingCapital(double remainingCapital) {
        this.remainingCapital = remainingCapital;
    }

     public List<PortfolioStock> getPortfolioStocks() {
        return portfolioStocks;
    }

    public void setPortfolioStocks(List<PortfolioStock> portfolioStocks) {
        this.portfolioStocks = portfolioStocks;
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
