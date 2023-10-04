package com.oop.appa.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dao.PortfolioRepository;
import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.PerformanceMetrics;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.User;

@Service
public class PortfolioService {
    private PortfolioRepository portfolioRepository;
    private UserRepository userRepository;

    @Autowired
    public PortfolioService(PortfolioRepository portfolioRepository, UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
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
    

    // DELETE
    public void delete(Portfolio entity) {
        portfolioRepository.delete(entity);
    }

    public void deleteById(Integer id) {
        portfolioRepository.deleteById(id);
    }

}
