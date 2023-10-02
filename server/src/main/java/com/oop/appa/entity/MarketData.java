package com.oop.appa.entity;

import java.sql.Date;

import jakarta.persistence.*;

@Entity
@Table(name = "MarketData")
public class MarketData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "market_data_id")
    private int marketDataId;

    @Column(name = "stock_id")
    private String stockId;

    @Column(name = "date")
    private Date date;

    @Column(name = "adjusted_close_price")
    private Float adjustedClosePrice;

    public int getMarketDataId() {
        return marketDataId;
    }

    public void setMarketDataId(int marketDataId) {
        this.marketDataId = marketDataId;
    }

    public String getStockId() {
        return stockId;
    }

    public void setStockId(String stockId) {
        this.stockId = stockId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Float getAdjustedClosePrice() {
        return adjustedClosePrice;
    }

    public void setAdjustedClosePrice(Float adjustedClosePrice) {
        this.adjustedClosePrice = adjustedClosePrice;
    }

    @Override
    public String toString() {
        return "MarketData [marketDataId=" + marketDataId + ", stockId=" + stockId + ", date=" + date
                + ", adjustedClosePrice=" + adjustedClosePrice + "]";
    }

}
