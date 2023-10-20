package com.oop.appa.controller;

import com.oop.appa.dto.PortfolioCreationDTO;
import com.oop.appa.dto.PortfolioStockCreationDTO;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.entity.Stock;
import com.oop.appa.entity.User;
import com.oop.appa.service.PortfolioService;
import com.oop.appa.service.PortfolioStockService;
import com.oop.appa.service.StockService;
import com.oop.appa.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/portfolios")
public class PortfolioController {
    private PortfolioService portfolioService;
    private UserService userService;
    private PortfolioStockService portfolioStockService;
    private StockService stockService;

    @Autowired
    public PortfolioController(PortfolioService portfolioService, UserService userService,
            PortfolioStockService portfolioStockService, StockService stockService) {
        this.portfolioService = portfolioService;
        this.userService = userService;
        this.portfolioStockService = portfolioStockService;
        this.stockService = stockService;
    }

    // GET endpoints
    @GetMapping()
    public List<Portfolio> findAll() {
        return portfolioService.findAll();
    }

    @GetMapping("/paged")
    public Page<Portfolio> findAllPaged(Pageable pageable) {
        return portfolioService.findAllPaged(pageable);
    }

    @GetMapping("/user/{user_id}")
    public List<Portfolio> findByUserId(@PathVariable Integer user_id) {
        return portfolioService.findByUserId(user_id);
    }

    @GetMapping("/{id}")
    public Optional<Portfolio> findById(@PathVariable Integer id) {
        return portfolioService.findById(id);
    }

    // POST endpoint for creating a new portfolio
    @PostMapping
    public ResponseEntity<?> createPortfolio(@RequestBody PortfolioCreationDTO portfolioDto) {
        try {
            Optional<User> userOptional = userService.findByUserId(portfolioDto.getUser().getId());
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>("User not found", HttpStatus.BAD_REQUEST);
            }
            Portfolio portfolio = new Portfolio();
            portfolio.setName(portfolioDto.getName());
            portfolio.setDescription(portfolioDto.getDescription());
            portfolio.setTotalCapital(portfolioDto.getTotalCapital());
            portfolio.setUser(userOptional.get());
            portfolioService.save(portfolio);
            return new ResponseEntity<>(portfolio, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT endpoint for updating an existing portfolio
    @PutMapping("/{portfolioId}")
    public void updatePortfolio(@PathVariable Integer portfolioId, @RequestBody Portfolio portfolio) {
        portfolioService.updatePortfolio(portfolioId, portfolio);
    }

    @PutMapping("/{portfolioId}/stocks")
    public void addStockPortfolio(@PathVariable Integer portfolioId, @RequestBody PortfolioStock stock) {
        portfolioService.addStockToPortfolio(portfolioId, stock);
    }

    // DELETE endpoints
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id) {
        portfolioService.deleteById(id);
    }

    @DeleteMapping
    public void delete(@RequestBody Portfolio portfolio) {
        portfolioService.delete(portfolio);
    }

    @GetMapping("/stocks")
    public List<PortfolioStock> findAllPortfolioStocks() {
        return portfolioStockService.findAll();
    }

    @GetMapping("/{portfolioId}/stocks/")
    public List<PortfolioStock> findByPortfolioId(@PathVariable Integer portfolioId) {
        return portfolioStockService.findByPortfolioId(portfolioId);
    }

    @PostMapping("/{portfolioId}/stocks")
    public ResponseEntity<?> addStockToPortfolio(@PathVariable Integer portfolioId,
            @RequestBody PortfolioStockCreationDTO stockDto) {
        try {
            Optional<Portfolio> portfolioOptional = portfolioService.findById(portfolioId);
            if (!portfolioOptional.isPresent()) {
                return new ResponseEntity<>("Portfolio not found", HttpStatus.BAD_REQUEST);
            }
            PortfolioStock portfolioStock = portfolioStockService.createPortfolioStock(portfolioOptional.get(),
                    stockDto);
            return new ResponseEntity<>(portfolioStock, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{portfolioId}/stocks/{portfolioStockId}/calculateReturn")
    public void calculatePortfolioStockReturn(@PathVariable Integer portfolioStockId) {
        portfolioStockService.calculatePortfolioStockReturn(portfolioStockId);
    }

}
