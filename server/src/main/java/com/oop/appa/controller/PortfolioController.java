package com.oop.appa.controller;

import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.service.PortfolioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/portfolios")
public class PortfolioController {
    private PortfolioService portfolioService;
    
    @Autowired
    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
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

    // POST endpoint for creating a new portfolio
    @PostMapping
    public void createPortfolio(@RequestBody Portfolio portfolio) {
        portfolioService.save(portfolio);
    }

    // PUT endpoint for updating an existing portfolio
    @PutMapping
    public void updatePortfolio(@RequestBody Portfolio portfolio) {
        portfolioService.save(portfolio);
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
