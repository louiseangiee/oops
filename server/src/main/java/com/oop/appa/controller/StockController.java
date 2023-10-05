package com.oop.appa.controller;

import com.oop.appa.entity.Stock;
import com.oop.appa.service.StockService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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
        System.out.println(stock); // NOTE: post and put here does the same thing --> if i post a stock with the same symbol, it will update the existing stock instead of giving an error
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
