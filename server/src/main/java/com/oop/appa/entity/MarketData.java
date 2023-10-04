package com.oop.appa.entity;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "market_data")
public class MarketData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "market_data_id")
    private Integer marketDataId;

    @Column(name = "date")
    private Date date;

    @Column(name = "adjusted_close_price")
    private Float adjustedClosePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_symbol")
    @JsonIgnore
    private Stock stock;


    public Integer getMarketDataId() {
        return marketDataId;
    }

    public void setMarketDataId(Integer marketDataId) {
        this.marketDataId = marketDataId;
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

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    @Override
    public String toString() {
        return "MarketData [marketDataId=" + marketDataId + ", date=" + date + ", adjustedClosePrice="
                + adjustedClosePrice + ", stock=" + stock.getStockSymbol() + "]";
    }

}
