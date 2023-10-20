package com.oop.appa.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.oop.appa.dao.PortfolioRepository;
import com.oop.appa.dao.PortfolioStockRepository;
import com.oop.appa.dao.StockRepository;
import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.PerformanceMetrics;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.entity.Stock;
import com.oop.appa.entity.User;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class PortfolioService {
    private PortfolioRepository portfolioRepository;
    private UserRepository userRepository;
    private PortfolioStockRepository portfolioStockRepository;
    private StockRepository stockRepository;
    private MarketDataService marketDataService;

    @Autowired
    public PortfolioService(PortfolioRepository portfolioRepository, UserRepository userRepository,
            PortfolioStockRepository portfolioStockRepository, StockRepository stockRepository, MarketDataService marketDataService) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
        this.portfolioStockRepository = portfolioStockRepository;
        this.stockRepository = stockRepository;
        this.marketDataService = marketDataService;
    }

    // GET
    public List<Portfolio> findAll() {
        return portfolioRepository.findAll();
    }

    public Page<Portfolio> findAllPaged(Pageable pageable) {
        return portfolioRepository.findAll(pageable);
    }

    public List<Portfolio> findByUserId(Integer user_id) {
        return portfolioRepository.findByUserId(user_id);
    }

    public Optional<Portfolio> findById(Integer id) {
        return portfolioRepository.findById(id);
    }

    // POST and UPDATE
    public void save(Portfolio portfolio) {
        
        if(portfolio.getUser() != null) {
            User user = userRepository.findById(portfolio.getUser().getId()).orElse(null);
            if(user != null) {
                portfolio.setUser(user);
            } else {
                System.out.println("No user found in DB with ID: " + portfolio.getUser().getId());
            }
        } else {
            System.out.println("Portfolio has no user");
        }

        if (portfolio.getPortfolioId() == null) {
            PerformanceMetrics performance = new PerformanceMetrics();

            portfolio.setPerformanceMetrics(performance);
            performance.setDateCalculated(LocalDate.now());
            performance.setPortfolio(portfolio);
        }
        portfolioRepository.save(portfolio);
    }

    @Transactional
    public void addStockToPortfolio(Integer portfolioId, PortfolioStock stockToAdd) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId).orElse(null);
        if (portfolio == null) {
            System.out.println("No portoflio found with ID: " + portfolioId);
            return;
        }

        Stock stockFromDb = stockRepository.findById(stockToAdd.getStock().getStockSymbol()).orElse(null);
        if (stockFromDb == null) {
            JsonNode stockInfo = marketDataService.fetchStockInfo(stockToAdd.getStock().getStockSymbol());
            Stock newStock = new Stock();
            newStock.setStockSymbol(stockInfo.get("Symbol").asText());
            newStock.setName(stockInfo.get("Name").asText());
            newStock.setIndustry(stockInfo.get("Industry").asText());
            newStock.setSector(stockInfo.get("Sector").asText());
            newStock.setCountry(stockInfo.get("Country").asText());
            stockRepository.save(newStock);
            stockFromDb = newStock;
        }
        stockToAdd.setStock(stockFromDb);

        // check if stock is already in portfolio
        boolean stockExists = portfolio.getPortfolioStocks().stream()
            .anyMatch(ps -> ps.getStock().getStockSymbol().equals(stockToAdd.getStock().getStockSymbol()));

        if (stockExists) {
            System.out.println("Stock already exists in the portfolio");
            return;
        }

        portfolio.getPortfolioStocks().add(stockToAdd);
        stockToAdd.setPortfolio(portfolio);

        portfolioStockRepository.save(stockToAdd);
    }

    public void updatePortfolio(Integer portfolioId, Portfolio portfolio) {
        Portfolio existingPortfolio = portfolioRepository.findById(portfolioId).orElse(null);
        // validations
        if(existingPortfolio == null) {
            System.out.println("No portoflio found with ID: " + portfolioId);
            return;
        }

        existingPortfolio.setName(portfolio.getName());
        existingPortfolio.setDescription(portfolio.getDescription());
        existingPortfolio.setTotalCapital(portfolio.getTotalCapital());

        portfolioRepository.save(existingPortfolio);
    }

    // DELETE
    public void delete(Portfolio entity) {
        portfolioRepository.delete(entity);
    }

    public void deleteById(Integer id) {
        portfolioRepository.deleteById(id);
    }
}
