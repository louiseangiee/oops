package com.oop.appa.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dao.AccessLogRepository;
import com.oop.appa.dao.PortfolioRepository;
import com.oop.appa.dao.UserRepository;
import com.oop.appa.dto.PortfolioCreationDTO;
import com.oop.appa.entity.AccessLog;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.User;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PortfolioService {
    private PortfolioRepository portfolioRepository;
    private UserRepository userRepository;
    private AccessLogRepository accessLogRepository;

    @Autowired
    public PortfolioService(PortfolioRepository portfolioRepository, UserRepository userRepository,
            AccessLogRepository accessLogRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
        this.accessLogRepository = accessLogRepository;
    }

    // GET
    public List<Portfolio> findAll() {
        try {
            return portfolioRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all portfolios service: ", e);
        }
    }

    public Page<Portfolio> findAllPaged(Pageable pageable) {
        try {
            return portfolioRepository.findAll(pageable);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all portfolios with pagination service: ", e);
        }
    }

    public List<Portfolio> findByUserId(Integer user_id) {
        try {
            return portfolioRepository.findByUserId(user_id);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all portfolios with pagination service: ", e);
        }
    }

    public Optional<Portfolio> findById(Integer id) {
        try {
            return portfolioRepository.findById(id);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching portfolio by id service: ", e);
        }
    }

    // POST
    public Portfolio createPortfolio(PortfolioCreationDTO portfolioDto) {
        try {
            User user = userRepository.findById(portfolioDto.getUser().getId())
                    .orElseThrow(
                            () -> new NoSuchElementException(
                                    "User not found for ID: " + portfolioDto.getUser().getId()));

            Portfolio portfolio = new Portfolio();
            portfolio.setName(portfolioDto.getName());
            portfolio.setDescription(portfolioDto.getDescription());
            portfolio.setTotalCapital(portfolioDto.getTotalCapital());
            portfolio.setUser(user);

            Portfolio savedPortfolio = portfolioRepository.save(portfolio);

            String action = String.format("User creates portfolio ID: %d Name: %s", savedPortfolio.getPortfolioId(),
                    savedPortfolio.getName());
            accessLogRepository.save(new AccessLog(user, action));
            return savedPortfolio;
        } catch (Exception e) {
            throw new RuntimeException("Error creating a new portfolio service: ", e);
        }

    }

    // UPDATE
    public Portfolio updatePortfolio(Integer portfolioId, Portfolio portfolio) {
        try {
            Portfolio existingPortfolio = portfolioRepository.findById(portfolioId)
                    .orElseThrow(() -> new EntityNotFoundException("No portfolio found with ID: " + portfolioId + "."));

            existingPortfolio.setName(portfolio.getName());
            existingPortfolio.setDescription(portfolio.getDescription());
            existingPortfolio.setTotalCapital(portfolio.getTotalCapital());

            Portfolio updatedPortfolio = portfolioRepository.save(existingPortfolio);

            String action = String.format("User updates portfolio ID: %d Name: %s", portfolio.getPortfolioId(),
                    portfolio.getName());
            accessLogRepository.save(new AccessLog(portfolio.getUser(), action));
            return updatedPortfolio;
        } catch (Exception e) {
            throw new RuntimeException("Error updating an existing portfolio service: ", e);
        }

    }

    // DELETE
    public void deleteById(Integer id) {
        try {
            Portfolio existingPortfolio = portfolioRepository.findById(id).orElseThrow(
                    () -> new EntityNotFoundException("No portfolio found with ID: " + id + "."));
            User deletedPortfolioUser = existingPortfolio.getUser();
            Integer deletedPortfolioId = existingPortfolio.getPortfolioId();
            String portfolioName = existingPortfolio.getName();
            portfolioRepository.deleteById(id);
            String action = String.format("User deletes portfolio ID: %d Name: %s", deletedPortfolioId, portfolioName);
            accessLogRepository.save(new AccessLog(deletedPortfolioUser, action));
        } catch (Exception e) {
            throw new RuntimeException("Error deleting portfolio service: ", e);
        }

    }

    public void deleteByUserId(Integer user_id) {
        try {
            portfolioRepository.deleteByUserId(user_id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting portfolio service: ", e);
        }
    }
}
