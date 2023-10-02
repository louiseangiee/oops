package com.oop.appa.controller;

import com.oop.appa.entity.Stock;
import com.oop.appa.dao.StockRepository;
import com.oop.appa.service.StockService;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/stocks")
public class StockController {
    private StockService stockService;
    
    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // GET endpoints
    @GetMapping()
    public List<Stock> findAll() {
        return stockService.findAll();
    }

    @GetMapping("/paged")
    public Page<Stock> findAllPaged(Pageable pageable) {
        return stockService.findAllPaged(pageable);
    }

    // POST endpoint for creating a new stock
    @PostMapping()
    public void createStock(@RequestBody Stock stock) {
        System.out.println(stock);
        stockService.save(stock);
    }

    // PUT endpoint for updating an existing stock
    @PutMapping
    public void updateStock(@RequestBody Stock stock) {
        stockService.save(stock);
    }

    // DELETE endpoints
    @DeleteMapping("/{stockSymbol}")
    public void deleteByStockSymbol(@PathVariable String stockSymbol) {
        stockService.deleteByStockSymbol(stockSymbol);
    }

    @DeleteMapping
    public void delete(@RequestBody Stock stock) {
        stockService.delete(stock);
    }

}
