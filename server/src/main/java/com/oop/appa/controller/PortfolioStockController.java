package com.oop.appa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.oop.appa.service.PortfolioStockService;

@RestController
@RequestMapping("/portfolioStocks")
public class PortfolioStockController {
    // todo: edit this if needed
    private PortfolioStockService portfolioStockService;
    @Autowired
    public PortfolioStockController(PortfolioStockService portfolioStockService) {
        this.portfolioStockService = portfolioStockService;
    }
    @GetMapping("calculatePortfolioStockReturn")
    public void calculatePortfolioStockReturn(@PathVariable Integer portfolio_stock_id) {
        portfolioStockService.calculatePortfolioStockReturn(portfolio_stock_id);
    }
}
