package com.oop.appa.controller;

import com.oop.appa.dto.PortfolioCreationDTO;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.entity.User;
import com.oop.appa.service.PortfolioService;
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

    @Autowired
    public PortfolioController(PortfolioService portfolioService, UserService userService) {
        this.portfolioService = portfolioService;
        this.userService = userService;
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
    // POST endpoint for creating a new portfolio
    @PostMapping
    public ResponseEntity<?> createPortfolio(@RequestBody PortfolioCreationDTO portfolioDto) {
        try {
            // Fetch the user based on userId from the DTO's nested UserReference
            Optional<User> userOptional = userService.findByUserId(portfolioDto.getUser().getId());

            if (!userOptional.isPresent()) {
                return new ResponseEntity<>("User not found", HttpStatus.BAD_REQUEST);
            }

            // Create a new Portfolio entity and set its fields using the DTO
            Portfolio portfolio = new Portfolio();
            portfolio.setName(portfolioDto.getName());
            portfolio.setDescription(portfolioDto.getDescription());
            portfolio.setTotalCapital(portfolioDto.getTotalCapital());
            portfolio.setUser(userOptional.get()); // Use .get() to retrieve the User from the Optional

            // Save the new Portfolio entity
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

}
