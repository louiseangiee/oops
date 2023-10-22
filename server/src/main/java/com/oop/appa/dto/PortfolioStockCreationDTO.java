package com.oop.appa.dto;

import java.time.LocalDate;

public class PortfolioStockCreationDTO {
    private int portfolioId;
    private String symbol; // Replaced StockReference with symbol
    private float buyPrice;
    private int quantity;
    private LocalDate buyDate;

    public PortfolioStockCreationDTO() {}

    public PortfolioStockCreationDTO(int portfolioId, String symbol, float buyPrice, int quantity, LocalDate buyDate) {
        this.portfolioId = portfolioId;
        this.symbol = symbol;
        this.buyPrice = buyPrice;
        this.quantity = quantity;
        this.buyDate = buyDate;
    }

    public int getPortfolioId() {
        return portfolioId;
    }

    public void setPortfolioId(int portfolioId) {
        this.portfolioId = portfolioId;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public float getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(float buyPrice) {
        this.buyPrice = buyPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getBuyDate() {
        return buyDate;
    }

    public void setBuyDate(LocalDate buyDate) {
        this.buyDate = buyDate;
    }
}
