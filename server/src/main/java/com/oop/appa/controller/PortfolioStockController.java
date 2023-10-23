package com.oop.appa.controller;

import com.oop.appa.dto.PortfolioStockCreationDTO;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.exception.ErrorResponse;
import com.oop.appa.service.PortfolioStockService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/portfolioStocks")
public class PortfolioStockController {
    private PortfolioStockService portfolioStockService;

    @Autowired
    public PortfolioStockController(PortfolioStockService portfolioStockService) {
        this.portfolioStockService = portfolioStockService;
    }

    //GET
    @Operation(summary = "Retrieve all portfolio stocks")
    @GetMapping("/")
    public ResponseEntity<?> findAllPortfolioStocks() {
        try {
            List<PortfolioStock> portfolios = portfolioStockService.findAll();
            return ResponseEntity.ok(portfolios);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all portfolio stocks");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Retrieve all portfolio stocks by portfolio id")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @GetMapping("/{portfolioId}")
    public ResponseEntity<?> findByPortfolioId(@PathVariable Integer portfolioId) {
        try {
            List<PortfolioStock> portfolioStocks = portfolioStockService.findByPortfolioId(portfolioId);
            return ResponseEntity.ok(portfolioStocks);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all portfolio stocks by portfolio id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get an existing portfolio's portfolio stock by stock symbol")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}")
    public ResponseEntity<?> findByPortfolioIdAndStockSymbol(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            List<PortfolioStock> portfolios = portfolioStockService.findByPortfolioIdAndStockSymbol(portfolioId, stockSymbol);
            return ResponseEntity.ok(portfolios);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching portfolio stock by stock symbol");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    
    //POST
    @Operation(summary = "Create a new portfolio stock")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @PostMapping("/{portfolioId}")
    public ResponseEntity<?> addStockToPortfolio(@PathVariable Integer portfolioId,
            @RequestBody PortfolioStockCreationDTO stockDto) {
        try {
            PortfolioStock portfolioStock = portfolioStockService.createPortfolioStock(stockDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(portfolioStock);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error creating a new portfolio stock");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    //Delete
    @Operation(summary = "Delete a portfolio stock by id")
    @Parameter(name = "id", description = "portfolio id")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePortfolioStockById(@PathVariable Integer id) {
        try {
            portfolioStockService.deleteById(id);
            return ResponseEntity.ok("Portfolio stock with ID " + id + " was successfully deleted.");

        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting portfolio stock by id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    //Other endpoints
    @Operation(summary = "Get the weight of a specific stock within a portfolio")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}/weight")
    public ResponseEntity<?> getStockWeight(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            double stockWeight = portfolioStockService.calculateStockWeight(portfolioId, stockSymbol);
            return ResponseEntity.ok(stockWeight);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error calculating stock weight");
            error.setDetails(e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @Operation(summary = "Calculate weighted return of a stock in a portfolio by portfolio id and stock symbol")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}/calculateWeightedReturn")
    public ResponseEntity<?> calculateWeightedStockReturn(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            double weightedReturn = portfolioStockService.calculateWeightedStockReturn(portfolioId, stockSymbol);
            return ResponseEntity.ok(weightedReturn);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error calculating weighted return");
            error.setDetails(e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
}
