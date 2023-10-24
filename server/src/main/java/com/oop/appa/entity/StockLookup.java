package com.oop.appa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_lookup")
public class StockLookup {
    
    @Id
    @Column(name = "stock_symbol")
    private String stockSymbol;

    @Column(name = "name")
    private String name;

    public StockLookup() {

    }

    public StockLookup(String stockSymbol, String name) {
        this.stockSymbol = stockSymbol;
        this.name = name;
    }

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

    @Override
    public String toString() {
        return "StockLookup [stockSymbol=" + stockSymbol + ", name=" + name + "]";
    }

}
