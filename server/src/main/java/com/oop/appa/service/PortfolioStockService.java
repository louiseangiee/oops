package com.oop.appa.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.hibernate.mapping.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dao.PortfolioStockRepository;
import com.oop.appa.dto.PortfolioStockCreationDTO;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.entity.Stock;

import jakarta.persistence.criteria.CriteriaBuilder.In;

@Service
public class PortfolioStockService {
    private PortfolioStockRepository portfolioStockRepository;
    private MarketDataService marketDataService;
    private StockService stockService;

    @Autowired
    public PortfolioStockService(PortfolioStockRepository portfolioStockRepository, MarketDataService marketDataService,
            StockService stockService) {
        this.portfolioStockRepository = portfolioStockRepository;
        this.marketDataService = marketDataService;
        this.stockService = stockService;
    }

    // GET
    public List<PortfolioStock> findAll() {
        return portfolioStockRepository.findAll();
    }

    public Page<PortfolioStock> findAllPaged(Pageable pageable) {
        return portfolioStockRepository.findAll(pageable);
    }

    public List<PortfolioStock> findByPortfolioId(Integer portfolio_id) {
        return portfolioStockRepository.findByPortfolioPortfolioId(portfolio_id);
    }

    // POST
    public PortfolioStock createPortfolioStock(Portfolio portfolio, PortfolioStockCreationDTO dto) {
        Stock stock = stockService.findBySymbol(dto.getStock().getSymbol())
                .orElseGet(() -> {
                    Stock newStock = new Stock();
                    newStock.setStockSymbol(dto.getStock().getSymbol());
                    return stockService.save(newStock);
                });
        PortfolioStock portfolioStock = new PortfolioStock();
        portfolioStock.setStock(stock);
        portfolioStock.setBuyPrice(dto.getBuyPrice());
        portfolioStock.setQuantity(dto.getQuantity());
        portfolioStock.setBuyDate(dto.getBuyDate());
        portfolioStock.setPortfolio(portfolio);
        return portfolioStockRepository.save(portfolioStock);
    }

    // UPDATE
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

    public List<PortfolioStock> findByPortfolioIdAndStockSymbol(Integer portfolioId, String stockSymbol) {
        return portfolioStockRepository.findByPortfolioPortfolioIdAndStockStockSymbol(portfolioId, stockSymbol);
    }

    public double calculateWeightedStockReturn(Integer portfolioId, String stockSymbol) {
        List<PortfolioStock> stocks = findByPortfolioIdAndStockSymbol(portfolioId, stockSymbol);
        if (stocks.isEmpty()) {
            throw new IllegalArgumentException("No PortfolioStock found for portfolio ID: " + portfolioId + " and stock symbol: " + stockSymbol);
        }
    
        double totalReturn = 0;
        int totalQuantity = 0;
    
        double currentPrice = marketDataService.fetchCurrentData(stockSymbol).path("Global Quote")
                .path("5. close price").asDouble();
    
        for (PortfolioStock stock : stocks) {
            totalQuantity += stock.getQuantity();
        }
    
        for (PortfolioStock stock : stocks) {
            double buyPrice = stock.getBuyPrice();
            double individualReturn = ((currentPrice - buyPrice) / buyPrice) * 100;
    
            totalReturn += (double) stock.getQuantity() / totalQuantity * individualReturn;
        }
    
        return totalReturn;
    }
    

    public double calculateAnnualisedReturn(Integer portfolioStockId) {
        PortfolioStock stock = portfolioStockRepository.findById(portfolioStockId).orElse(null);
        if (stock == null) {
            throw new IllegalArgumentException("PortfolioStock not found for ID: " + portfolioStockId);
        }
        double currentPrice = marketDataService.fetchCurrentData(stock.getStock().getStockSymbol()).path("Global Quote")
                .path("5. close price").asDouble();
        double buyPrice = stock.getBuyPrice();
        long days = getDaysHeld(portfolioStockId);

        return ((Math.pow((currentPrice / buyPrice), (365.0 / days))) - 1) * 100;
    }

    public Long getDaysHeld(Integer portfolioStockId) {
        PortfolioStock stock = portfolioStockRepository.findById(portfolioStockId).orElse(null);
        if (stock == null || stock.getBuyDate() == null) {
            throw new IllegalArgumentException("Invalid PortfolioStock or buy date for ID: " + portfolioStockId);
        }
        LocalDate buyDate = stock.getBuyDate();
        LocalDate currentDate = LocalDate.now();
        return ChronoUnit.DAYS.between(buyDate, currentDate);
    }

}
