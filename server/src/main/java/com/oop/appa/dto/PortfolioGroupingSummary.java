package com.oop.appa.dto;

import java.util.HashMap;
import java.util.Map;

public class PortfolioGroupingSummary {
    private double totalPortfolioValue;
    private Map<String, Allocation> allocations;
    private Map<String, StockInfo> portfolioStocks;

    public PortfolioGroupingSummary() {
        this.allocations = new HashMap<>();
        this.portfolioStocks = new HashMap<>();
    }

    public double getTotalPortfolioValue() {
        return totalPortfolioValue;
    }

    public void setTotalPortfolioValue(double totalPortfolioValue) {
        this.totalPortfolioValue = totalPortfolioValue;
    }

    public Map<String, Allocation> getAllocations() {
        return allocations;
    }

    public void setAllocations(Map<String, Allocation> allocations) {
        this.allocations = allocations;
    }

    public Map<String, StockInfo> getPortfolioStocks() {
        return portfolioStocks;
    }

    public void setPortfolioStocks(Map<String, StockInfo> portfolioStocks) {
        this.portfolioStocks = portfolioStocks;
    }

    // Nested Allocation class
    public static class Allocation {
        private double percentage;
        private double actualValue;

        public Allocation(double actualValue, double percentage) {
            this.actualValue = actualValue;
            this.percentage = percentage;
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }

        public double getActualValue() {
            return actualValue;
        }

        public void setActualValue(double actualValue) {
            this.actualValue = actualValue;
        }
    }

    // Nested StockInfo class
    public static class StockInfo {
        private int quantity;
        private double currentPrice;
        private String sector;
        private String industry;
        private String exchange;
        private String country;

        public StockInfo(int quantity, double currentPrice, String sector, String industry, String exchange, String country) {
            this.quantity = quantity;
            this.currentPrice = currentPrice;
            this.sector = sector;
            this.industry = industry;
            this.exchange = exchange;
            this.country = country;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public double getCurrentPrice() {
            return currentPrice;
        }

        public void setCurrentPrice(double currentPrice) {
            this.currentPrice = currentPrice;
        }

        public String getSector() {
            return sector;
        }

        public void setSector(String sector) {
            this.sector = sector;
        }

        public String getIndustry() {
            return industry;
        }

        public void setIndustry(String industry) {
            this.industry = industry;
        }

        public String getExchange() {
            return exchange;
        }

        public void setExchange(String exchange) {
            this.exchange = exchange;
        }
    }
}
