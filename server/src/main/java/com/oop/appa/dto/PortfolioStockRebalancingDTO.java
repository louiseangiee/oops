package com.oop.appa.dto;

import java.util.Map;

public class PortfolioStockRebalancingDTO {
    private int portfolioId;
    private Map<String, Integer> portfolioStocks;

    // Constructor
    public PortfolioStockRebalancingDTO(int portfolioId, Map<String, Integer> portfolioStocks) {
        this.portfolioId = portfolioId;
        this.portfolioStocks = portfolioStocks;
    }

    // Getters and Setters
    public int getPortfolioId() {
        return portfolioId;
    }

    public void setPortfolioId(int portfolioId) {
        this.portfolioId = portfolioId;
    }

    public Map<String, Integer> getPortfolioStocks() {
        return portfolioStocks;
    }

    public void setPortfolioStocks(Map<String, Integer> portfolioStocks) {
        this.portfolioStocks = portfolioStocks;
    }
}