package com.oop.appa.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dao.PortfolioRepository;
import com.oop.appa.dao.PortfolioStockRepository;
import com.oop.appa.dao.StockRepository;
import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.PerformanceMetrics;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.entity.Stock;
import com.oop.appa.entity.User;

import jakarta.transaction.Transactional;

@Service
public class PortfolioService {
    private PortfolioRepository portfolioRepository;
    private UserRepository userRepository;
    private PortfolioStockRepository portfolioStockRepository;
    private StockRepository stockRepository;

    @Autowired
    public PortfolioService(PortfolioRepository portfolioRepository, UserRepository userRepository,
            PortfolioStockRepository portfolioStockRepository, StockRepository stockRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
        this.portfolioStockRepository = portfolioStockRepository;
        this.stockRepository = stockRepository;
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
            System.out.println("No stock found with symbol: " + stockToAdd.getStock().getStockSymbol());
            return;
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

    // DELETE
    public void delete(Portfolio entity) {
        portfolioRepository.delete(entity);
    }

    public void deleteById(Integer id) {
        portfolioRepository.deleteById(id);
    }
}
