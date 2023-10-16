package com.oop.appa.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.oop.appa.entity.Stock;
import com.oop.appa.service.StockService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/calculateOneYearReturn")
    public ResponseEntity<Double> calculateOneYearReturn(@RequestParam String symbol) {
        try {
            double oneYearReturn = stockService.calculateOneYearReturn(symbol);
            System.out.println(oneYearReturn);
            return ResponseEntity.ok(oneYearReturn);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @GetMapping("/calculateOneMonthReturn")
    public ResponseEntity<Double> calculateOneMonthReturn(@RequestParam String symbol) {
        try {
            double oneMonthReturn = stockService.calculateOneMonthReturn(symbol);
            return ResponseEntity.ok(oneMonthReturn);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @GetMapping("/calculateOneWeekReturn")
    public ResponseEntity<Double> calculateOneWeekReturn(@RequestParam String symbol) {
        try {
            double oneWeekReturn = stockService.calculateOneWeekReturn(symbol);
            return ResponseEntity.ok(oneWeekReturn);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @GetMapping("/calculateOneDayReturn")
    public ResponseEntity<Double> calculateOneDayReturn(@RequestParam String symbol) {
        try {
            double oneDayReturn = stockService.calculateYesterdayReturn(symbol);
            return ResponseEntity.ok(oneDayReturn);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @GetMapping("/OneYearData")
    public ResponseEntity<List<Map<String, Object>>> fetchOneYearData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneYearData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/OneQuarterData")
    public ResponseEntity <List<Map<String, Object>>> fetchOneQuarterData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneQuarterData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/OneMonthData")
    public ResponseEntity <List<Map<String, Object>>> fetchOneMonthData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneMonthData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/OneWeekData")
    public ResponseEntity <List<Map<String, Object>>> fetchOneWeekData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneWeekData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

}
