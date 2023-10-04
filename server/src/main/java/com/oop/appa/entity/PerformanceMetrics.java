package com.oop.appa.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;


@Entity
@Table(name="portfolio_performance_metrics")
public class PerformanceMetrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "performance_metric_id")
    private Integer performanceMetricId;

    @OneToOne(mappedBy = "performanceMetrics", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JsonIgnore
    private Portfolio portfolio;

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

    public Integer getPerformanceMetricId() {
        return performanceMetricId;
    }

    public Portfolio getPortfolio() {
        return portfolio;
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

    public void setPerformanceMetricId(Integer performanceMetricId) {
        this.performanceMetricId = performanceMetricId;
    }

    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
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

    @Override
    public String toString() {
        return "PerformanceMetrics [performanceMetricId=" + performanceMetricId + ", portfolio=" + portfolio.getPortfolioId()
                + ", overallReturns=" + overallReturns + ", marketExposureByIndustry=" + marketExposureByIndustry
                + ", marketExposureByGeography=" + marketExposureByGeography + ", marketExposureByCurrency="
                + marketExposureByCurrency + ", quarterlyReturns=" + quarterlyReturns + ", annualizedReturns="
                + annualizedReturns + ", dateCalculated=" + dateCalculated + "]";
    }
 
}

