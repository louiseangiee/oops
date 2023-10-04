package com.oop.appa.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name="portfolio_stocks")
public class PortfolioStock {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_stock_id")
    private Integer id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "portfolio_id", nullable = false)
    @JsonIgnore
    private Portfolio portfolio;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "stock_symbol", nullable = false)
    @JsonIgnore
    private Stock stock;

    @Column(name = "buy_price")
    private float buyPrice;

    @Column(name = "quantity")
    private Integer quantity;

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

    @Override
    public String toString() {
        return "PortfolioStock [id=" + id + ", portfolio=" + portfolio.getPortfolioId() + ", stock=" + stock.getStockSymbol() + ", buyPrice=" + buyPrice
                + ", quantity=" + quantity + "]";
    }

}
