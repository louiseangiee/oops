package com.oop.appa.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dao.PortfolioStockRepository;
import com.oop.appa.entity.PortfolioStock;

import jakarta.persistence.criteria.CriteriaBuilder.In;

@Service
public class PortfolioStockService {
    private PortfolioStockRepository portfolioStockRepository;
    private MarketDataService marketDataService;

    @Autowired
    public PortfolioStockService(PortfolioStockRepository portfolioStockRepository) {
        this.portfolioStockRepository = portfolioStockRepository;
    }

    // GET
    public List<PortfolioStock> findAll() {
        return portfolioStockRepository.findAll();
    }

    public Page<PortfolioStock> findAllPaged(Pageable pageable) {
        return portfolioStockRepository.findAll(pageable);
    }

    // POST and UPDATE
    public void save(PortfolioStock stock) {
        portfolioStockRepository.save(stock);
    }

    // DELETE
    public void delete(PortfolioStock stock) {
        portfolioStockRepository.delete(stock);
    }

    public void deleteById(int portfolioStockId) {
        portfolioStockRepository.deleteById(portfolioStockId);
    }

    public double calculatePortfolioStockReturn(Integer portfolioStockId) {
        PortfolioStock stock = portfolioStockRepository.findById(portfolioStockId).orElse(null);
        double currentPrice = marketDataService.fetchCurrentData(stock.getStock().getStockSymbol()).path("Global Quote")
                .path("5. close price").asDouble();
        double buyPrice = stock.getBuyPrice();

        return ((currentPrice - buyPrice) / buyPrice) * 100;
    }

    public double calculateAnnualisedReturn(Integer portfolioStockId) {
        PortfolioStock stock = portfolioStockRepository.findById(portfolioStockId).orElse(null);
        double currentPrice = marketDataService.fetchCurrentData(stock.getStock().getStockSymbol()).path("Global Quote")
                .path("5. close price").asDouble();
        double buyPrice = stock.getBuyPrice();
        long days = getDaysHeld(portfolioStockId);

        return ((Math.pow((currentPrice / buyPrice), (365 / days))) - 1) * 100;
    }

    public Long getDaysHeld(Integer portfolioStockId) {
        PortfolioStock stock = portfolioStockRepository.findById(portfolioStockId).orElse(null);
        if (stock == null || stock.getBuyDate() == null) {
            return null; // or throw an exception or return a default value
        }
        LocalDate buyDate = stock.getBuyDate();
        LocalDate currentDate = LocalDate.now();
        return ChronoUnit.DAYS.between(buyDate, currentDate);
    }

}
