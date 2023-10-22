package com.oop.appa.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import io.swagger.v3.oas.annotations.Operation;

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
    @Operation(summary = "Retrieve all portfolios")
    @GetMapping()
    public List<Portfolio> findAll() {
        return portfolioService.findAll();
    }

    @Operation(summary = "Retrieve all portfolios with pagination")
    @GetMapping("/paged")
    public Page<Portfolio> findAllPaged(Pageable pageable) {
        return portfolioService.findAllPaged(pageable);
    }

    @Operation(summary = "Retrieve all portfolios by user id")
    @GetMapping("/user/{user_id}")
    public List<Portfolio> findByUserId(@PathVariable Integer user_id) {
        return portfolioService.findByUserId(user_id);
    }

    @Operation(summary = "Retrieve a portfolio by portfolio id")
    @GetMapping("/{id}")
    public Optional<Portfolio> findById(@PathVariable Integer id) {
        return portfolioService.findById(id);
    }

    // POST endpoint for creating a new portfolio
    @Operation(summary = "Create a new portfolio")
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
    @Operation(summary = "Update an existing portfolio")
    @PutMapping("/{portfolioId}")
    public void updatePortfolio(@PathVariable Integer portfolioId, @RequestBody Portfolio portfolio) {
        portfolioService.updatePortfolio(portfolioId, portfolio);
    }

    // @PutMapping("/{portfolioId}/stocks")
    // public void addStockPortfolio(@PathVariable Integer portfolioId, @RequestBody
    // PortfolioStock stock) {
    // portfolioService.addStockToPortfolio(portfolioId, stock);
    // }

    // DELETE endpoints
    @Operation(summary = "Delete a portfolio by id")
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id) {
        portfolioService.deleteById(id);
    }

    @Operation(summary = "Delete a portfolio")
    @DeleteMapping
    public void delete(@RequestBody Portfolio portfolio) {
        portfolioService.delete(portfolio);
    }

    // PortfolioStock endpoints
    @Operation(summary = "Retrieve all portfolio stocks")
    @GetMapping("/stocks")
    public List<PortfolioStock> findAllPortfolioStocks() {
        return portfolioStockService.findAll();
    }

    @Operation(summary = "Retrieve all portfolio stocks by portfolio id")
    @GetMapping("/{portfolioId}/stocks/")
    public List<PortfolioStock> findByPortfolioId(@PathVariable Integer portfolioId) {
        return portfolioStockService.findByPortfolioId(portfolioId);
    }

    @Operation(summary = "Create a new portfolio stock")
    @PostMapping("/{portfolioId}/stocks")
    public ResponseEntity<PortfolioStock> addStockToPortfolio(@PathVariable Integer portfolioId,
            @RequestBody PortfolioStockCreationDTO stockDto) {
        try {
            PortfolioStock portfolioStock = portfolioStockService.createPortfolioStock(stockDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(portfolioStock);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Operation(summary = "Get the weight of a specific stock within a portfolio")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}/weight")
    public ResponseEntity<Double> getStockWeight(@PathVariable Integer portfolioId, 
                                                 @PathVariable String stockSymbol) {
        try {
            double stockWeight = portfolioStockService.calculateStockWeight(portfolioId, stockSymbol);
            return ResponseEntity.ok(stockWeight);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @Operation(summary = "Get an existing portfolio's portfolio stock by stock symbol")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}")
    public List<PortfolioStock> findByPortfolioIdAndStockSymbol(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        return portfolioStockService.findByPortfolioIdAndStockSymbol(portfolioId, stockSymbol);
    }

    @Operation(summary = "Calculate weighted return of a stock in a portfolio by portfolio id and stock symbol")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}/calculateWeightedReturn")
    public ResponseEntity<Double> calculateWeightedStockReturn(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            double weightedReturn = portfolioStockService.calculateWeightedStockReturn(portfolioId, stockSymbol);
            return ResponseEntity.ok(weightedReturn);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }

}
