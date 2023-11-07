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
public class PortfolioServiceImpl implements PortfolioService {
    private PortfolioRepository portfolioRepository;
    private UserRepository userRepository;
    private AccessLogRepository accessLogRepository;

    @Autowired
    public PortfolioServiceImpl(PortfolioRepository portfolioRepository, UserRepository userRepository,
            AccessLogRepository accessLogRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
        this.accessLogRepository = accessLogRepository;
    }

    // GET
    @Override
    public List<Portfolio> findAll() {
        try {
            return portfolioRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all portfolios service: " + e.getMessage(), e);
        }
    }

    @Override
    public Page<Portfolio> findAllPaged(Pageable pageable) {
        try {
            return portfolioRepository.findAll(pageable);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all portfolios with pagination service: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Portfolio> findByUserId(Integer user_id) {
        try {
            return portfolioRepository.findByUserId(user_id);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all portfolios with pagination service: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Portfolio> findById(Integer id) {
        try {
            return portfolioRepository.findById(id);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching portfolio by id service: " + e.getMessage(), e);
        }
    }

    @Override
    public Portfolio findByUserIdPortfolioId(Integer user_id, Integer portfolio_id) {
        try {
            List<Portfolio> portfolios = portfolioRepository.findByUserId(user_id);
            Portfolio portfolio = portfolioRepository.findById(portfolio_id).orElseThrow(
                    () -> new EntityNotFoundException("No portfolio found with ID: " + portfolio_id + "."));
            if (portfolios.contains(portfolio)) {
                return portfolio;
            } else {
                throw new EntityNotFoundException("No portfolio found with ID: " + portfolio_id + " under user ID: "
                        + user_id + ".");
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching portfolio by user id and portfolio id service: "
                    + e.getMessage(), e);
        }
    }

    // POST
    @Override
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
            portfolio.setRemainingCapital(portfolioDto.getTotalCapital());
            portfolio.setUser(user);

            Portfolio savedPortfolio = portfolioRepository.save(portfolio);

            String action = String.format("User creates Portfolio #%d - %s", savedPortfolio.getPortfolioId(),
                    savedPortfolio.getName());
            accessLogRepository.save(new AccessLog(user, action));
            return savedPortfolio;
        } catch (Exception e) {
            throw new RuntimeException("Error creating a new portfolio service: " + e.getMessage(), e);
        }

    }

    // UPDATE
    @Override
    public Portfolio updatePortfolio(Integer portfolioId, Portfolio portfolio) {
        try {
            Portfolio existingPortfolio = portfolioRepository.findById(portfolioId)
                    .orElseThrow(() -> new EntityNotFoundException("No portfolio found with ID: " + portfolioId + "."));
            double originalTotalCapital = existingPortfolio.getTotalCapital();
            double newTotalCapital = portfolio.getTotalCapital();
            double capitalInvested = originalTotalCapital - existingPortfolio.getRemainingCapital();
            double newRemainingCapital;
    
            if (newTotalCapital > originalTotalCapital) {
                newRemainingCapital = existingPortfolio.getRemainingCapital() + (newTotalCapital - originalTotalCapital);
            } else if (newTotalCapital >= capitalInvested) {
                newRemainingCapital = newTotalCapital - capitalInvested;
            } else {
                throw new IllegalArgumentException("Total capital cannot be reduced below the amount already invested.");
            }
 
            String action = String.format("User updates portfolio #%d - %s", portfolio.getPortfolioId(), existingPortfolio.getName());
            String changes = "";
                if (!existingPortfolio.getName().equals(portfolio.getName())) {
                changes += String.format(" Name changed to '%s'.", portfolio.getName());
            }
            if (!existingPortfolio.getDescription().equals(portfolio.getDescription())) {
                changes += String.format(" Description changed to '%s'.",  portfolio.getDescription());
            }
            if (Double.compare(existingPortfolio.getTotalCapital(), newTotalCapital) != 0) {
                changes += String.format(" Total capital changed to %.2f.", newTotalCapital);
            }
            if (Double.compare(existingPortfolio.getRemainingCapital(), newRemainingCapital) != 0) {
                changes += String.format(" Remaining capital changed to %.2f.", newRemainingCapital);
            }
    
            if (!changes.isEmpty()) {
                action += ". Changes:" + changes;
            } else {
                action += " No changes detected.";
            }
    
            existingPortfolio.setName(portfolio.getName());
            existingPortfolio.setDescription(portfolio.getDescription());
            existingPortfolio.setTotalCapital(newTotalCapital);
            existingPortfolio.setRemainingCapital(newRemainingCapital);
    
            Portfolio updatedPortfolio = portfolioRepository.save(existingPortfolio);
            accessLogRepository.save(new AccessLog(existingPortfolio.getUser(), action));
    
            return updatedPortfolio;
        } catch (Exception e) {
            throw new RuntimeException("Error updating an existing portfolio service: " + e.getMessage(), e);
        }
    }
    
    // DELETE
    @Override
    public void deleteById(Integer id) {
        try {
            Portfolio existingPortfolio = portfolioRepository.findById(id).orElseThrow(
                    () -> new EntityNotFoundException("No portfolio found with ID: " + id + "."));
            User deletedPortfolioUser = existingPortfolio.getUser();
            Integer deletedPortfolioId = existingPortfolio.getPortfolioId();
            String portfolioName = existingPortfolio.getName();
            portfolioRepository.deleteById(id);
            String action = String.format("User deletes portfolio #%d - %s", deletedPortfolioId, portfolioName);
            accessLogRepository.save(new AccessLog(deletedPortfolioUser, action));
        } catch (Exception e) {
            throw new RuntimeException("Error deleting portfolio service: " + e.getMessage(), e);
        }

    }

    @Override
    public void deleteByUserId(Integer user_id) {
        try {
            portfolioRepository.deleteByUserId(user_id);
            List<Portfolio> portfolios = portfolioRepository.findByUserId(user_id);
            User user = portfolios.get(0).getUser();
            String action = String.format("User deletes all portfolios under user ID: " + user_id);
            accessLogRepository.save(new AccessLog(user, action));
        } catch (Exception e) {
            throw new RuntimeException("Error deleting portfolio service: " + e.getMessage(), e);
        }
    }
}
