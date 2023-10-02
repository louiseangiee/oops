package com.oop.appa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Stocks")
public class Stock {

    @Id
    @Column(name = "stock_symbol")
    private String stockSymbol;

    @Column(name = "name")
    private String name;

    @Column(name = "industry")
    private String industry;

    @Column(name = "sector")
    private String sector;

    @Column(name = "country")
    private String country;

    // Default constructor
    public Stock() {
    }

    // Parameterized constructor
    public Stock(String stockSymbol, String name, String industry, String sector, String country) {
        this.stockSymbol = stockSymbol;
        this.name = name;
        this.industry = industry;
        this.sector = sector;
        this.country = country;
    }

    // Getters and setters
    public String getStockSymbol() {
        return stockSymbol;
    }

    public void setStockSymbol(String stockSymbol) {
        this.stockSymbol = stockSymbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    // toString method
    @Override
    public String toString() {
        return "Stock [stockSymbol=" + stockSymbol + ", name=" + name + ", industry=" + industry + ", sector=" + sector
                + ", country=" + country + "]";
    }
}
