package com.oop.appa.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "portfolio_stocks")
public class PortfolioStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_stock_id")
    private Integer id;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH })
    @JoinColumn(name = "portfolio_id", nullable = false)
    @JsonBackReference(value = "portfolio-portfoliostock")
    private Portfolio portfolio;

    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH })
    @JoinColumn(name = "stock_symbol", nullable = false)
    @JsonBackReference(value = "stock-portfoliostock")
    private Stock stock;

    @Column(name = "buy_price")
    private float buyPrice;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "buy_date")
    private LocalDate buyDate;

    @JsonProperty("stockSymbol")
    public String getStockSymbol() {
        return this.stock.getStockSymbol();
    }

    @JsonProperty("stockExchange")
    public String getStockExchange() {
        return this.stock.getExchange();
    }

    @JsonProperty("stockCountry")
    public String getStockCountry() {
        return this.stock.getCountry();
    }

    @JsonProperty("stockIndustry")
    public String getStockIndustry() {
        return this.stock.getIndustry();
    }

    @JsonProperty("stockSector")
    public String getStockSector() {
        return this.stock.getSector();
    }

    public PortfolioStock() {

    }

    public PortfolioStock(Portfolio portfolio, Stock stock, float buyPrice, Integer quantity) {
        this.portfolio = portfolio;
        this.stock = stock;
        this.buyPrice = buyPrice;
        this.quantity = quantity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Portfolio getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public float getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(float buyPrice) {
        this.buyPrice = buyPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDate getBuyDate() {
        return buyDate;
    }

    public void setBuyDate(LocalDate buyDate) {
        this.buyDate = buyDate;
    }

    @Override
    public String toString() {
        return "PortfolioStock [id=" + id + ", portfolio=" + portfolio.getPortfolioId() + ", stock="
                + stock.getStockSymbol() + ", buyPrice=" + buyPrice
                + ", quantity=" + quantity + "]";
    }

}
