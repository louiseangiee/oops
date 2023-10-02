package com.oop.appa.entity;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.text.SimpleDateFormat;


@Entity
@Table(name="Performance_metrics")
public class PerformanceMetrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analytics_id")
    private Integer analyticsId;

    @Column(name = "portfolio_id", nullable = false)
    private Integer portfolioId;

    @Column(name = "overall_returns")
    private Float overallReturns;

    @Column(name = "market_exposure_by_industry")
    private Float marketExposureByIndustry;

    @Column(name = "market_exposure_by_geography")
    private Float marketExposureByGeography;

    @Column(name = "market_exposure_by_currency")
    private Float marketExposureByCurrency;

    @Column(name = "quarterly_returns")
    private Float quarterlyReturns;

    @Column(name = "annualized_returns")
    private Float annualizedReturns;

    @Column(name = "date_calculated", nullable = false)
    private LocalDate dateCalculated;


// All the Getters 

    public Integer getAnalyticsId() {
        return analyticsId;
    }

    public Integer getPortfolioId() {
        return portfolioId;
    }

    public Float getOverallReturns() {
        return overallReturns;
    }

    public Float getMarketExposureByIndustry() {
        return marketExposureByIndustry;
    }

    public Float getMarketExposureByGeography() {
        return marketExposureByGeography;
    }

    public Float getMarketExposureByCurrency() {
        return marketExposureByCurrency;
    }

    public Float getQuarterlyReturns() {
        return quarterlyReturns;
    }

    public Float getAnnualizedReturns() {
        return annualizedReturns;
    }

    public LocalDate getDateCalculated() {
        return dateCalculated;
    }

// All the Setter

    public void setAnalyticsId(Integer analyticsId) {
        this.analyticsId = analyticsId;
    }

    public void setPortfolioId(Integer portfolioId) {
        this.portfolioId = portfolioId;
    }

    public void setOverallReturns(Float overallReturns) {
        this.overallReturns = overallReturns;
    }

    public void setMarketExposureByIndustry(Float marketExposureByIndustry) {
        this.marketExposureByIndustry = marketExposureByIndustry;
    }

    public void setMarketExposureByGeography(Float marketExposureByGeography) {
        this.marketExposureByGeography = marketExposureByGeography;
    }

    public void setMarketExposureByCurrency(Float marketExposureByCurrency) {
        this.marketExposureByCurrency = marketExposureByCurrency;
    }

    public void setQuarterlyReturns(Float quarterlyReturns) {
        this.quarterlyReturns = quarterlyReturns;
    }

    public void setAnnualizedReturns(Float annualizedReturns) {
        this.annualizedReturns = annualizedReturns;
    }

    public void setDateCalculated(LocalDate dateCalculated) {
        this.dateCalculated = dateCalculated;
    }


// the to string 
 @Override
    public String toString() {
        return "PerformanceMetrics [analyticsId=" + analyticsId + ", portfolioId=" + portfolioId + ", overallReturns="
                + overallReturns + ", marketExposureByIndustry=" + marketExposureByIndustry
                + ", marketExposureByGeography=" + marketExposureByGeography + ", marketExposureByCurrency="
                + marketExposureByCurrency + ", quarterlyReturns=" + quarterlyReturns + ", annualizedReturns="
                + annualizedReturns + ", dateCalculated=" + dateCalculated + "]";
    }
}

