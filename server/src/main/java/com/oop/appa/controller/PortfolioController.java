package com.oop.appa.controller;

import com.oop.appa.dto.PortfolioCreationDTO;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.exception.ErrorResponse;
import com.oop.appa.service.PortfolioService;

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

    @Autowired
    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
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

    @Operation(summary = "Retrieve portfolio by user id and user id")
    @Parameter(name = "userId", description = "user id")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @GetMapping("/{userId}/{portfolioId}")
    public ResponseEntity<?> findByUserIdPortfolioId(@PathVariable Integer userId, @PathVariable Integer portfolioId) {
        try {
            Portfolio portfolio = portfolioService.findByUserIdPortfolioId(userId, portfolioId);
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching portfolio by user id and portfolio id");
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
}
