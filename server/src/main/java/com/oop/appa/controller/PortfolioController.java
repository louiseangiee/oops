package com.oop.appa.controller;

import com.oop.appa.dto.PortfolioCreationDTO;
import com.oop.appa.dto.PortfolioStockCreationDTO;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.exception.ErrorResponse;
import com.oop.appa.service.PortfolioService;
import com.oop.appa.service.PortfolioStockService;
import com.oop.appa.service.StockService;
import com.oop.appa.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

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
    private PortfolioStockService portfolioStockService;

    @Autowired
    public PortfolioController(PortfolioService portfolioService, UserService userService,
            PortfolioStockService portfolioStockService, StockService stockService) {
        this.portfolioService = portfolioService;
        this.portfolioStockService = portfolioStockService;
    }

    // GET endpoints
    @Operation(summary = "Retrieve all portfolios")
    @GetMapping()
    public ResponseEntity<?> findAll() {
        try {
            List<Portfolio> portfolios = portfolioService.findAll();
            return ResponseEntity.ok(portfolios);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all portfolios");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Retrieve all portfolios with pagination")
    @Parameter(name = "pageable", description = "pagination object")
    @GetMapping("/paged")
    public ResponseEntity<?> findAllPaged(Pageable pageable) {
        try {
            Page<Portfolio> portfolios = portfolioService.findAllPaged(pageable);
            return ResponseEntity.ok(portfolios);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all portfolios with pagination");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

    }

    @Operation(summary = "Retrieve all portfolios by user id")
    @Parameter(name = "user_id", description = "user id")
    @GetMapping("/user/{user_id}")
    public ResponseEntity<?> findByUserId(@PathVariable Integer user_id) {
        try {
            List<Portfolio> portoflios = portfolioService.findByUserId(user_id);
            return ResponseEntity.ok(portoflios);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all portfolios by user id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

    }

    @Operation(summary = "Retrieve a portfolio by portfolio id")
    @Parameter(name = "id", description = "portfolio id")
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Integer id) {
        try {
            Optional<Portfolio> portfolio = portfolioService.findById(id);
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching portfolio by id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

    }

    // POST endpoint for creating a new portfolio
    @Operation(summary = "Create a new portfolio")
    @PostMapping
    public ResponseEntity<?> createPortfolio(@RequestBody PortfolioCreationDTO portfolioDto) {
        try {
            Portfolio portfolio = portfolioService.createPortfolio(portfolioDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(portfolio);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error creating a new portfolio");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // PUT endpoint for updating an existing portfolio
    @Operation(summary = "Update an existing portfolio")
    @PutMapping("/{portfolioId}")
    public ResponseEntity<?> updatePortfolio(@PathVariable Integer portfolioId, @RequestBody Portfolio portfolio) {
        try {
            Portfolio updatedPortfolio = portfolioService.updatePortfolio(portfolioId, portfolio);
            return ResponseEntity.ok(updatedPortfolio);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error updating portfolio");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // DELETE endpoints
    @Operation(summary = "Delete a portfolio by id")
    @Parameter(name = "id", description = "portfolio id")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Integer id) {
        try {
            portfolioService.deleteById(id);
            return ResponseEntity.ok("Portfolio with ID " + id + " was successfully deleted.");

        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting portfolio by id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @Operation(summary="Delete a portfolio by user id")
    @Parameter(name = "user_id", description = "user id")
    @DeleteMapping("/user/{user_id}")
    public ResponseEntity<?> deleteByUserId(@PathVariable Integer user_id) {
        try {
            portfolioService.deleteByUserId(user_id);
            return ResponseEntity.ok("Portfolio with user ID " + user_id + " was successfully deleted.");

        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting portfolio by user id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    //////////////////////   PORTFOLIO STOCKS   //////////////////////////////////////

    // PortfolioStock endpoints
    //GET
    @Operation(summary = "Retrieve all portfolio stocks")
    @GetMapping("/stocks")
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
    @GetMapping("/{portfolioId}/stocks/")
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
    @PostMapping("/{portfolioId}/stocks")
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
    @DeleteMapping("/stocks/{id}")
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
