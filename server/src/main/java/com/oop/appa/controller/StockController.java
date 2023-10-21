package com.oop.appa.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.oop.appa.entity.Stock;
import com.oop.appa.service.MarketDataService;
import com.oop.appa.service.StockService;

import io.swagger.v3.oas.annotations.Operation;

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
    private MarketDataService marketDataService;
    
    @Autowired
    public StockController(StockService stockService, MarketDataService marketDataService) {
        this.stockService = stockService;
        this.marketDataService =  marketDataService;
    }

    @Operation(summary = "Retrieve all stocks")
    @GetMapping()
    public List<Stock> findAll() {
        return stockService.findAll();
    }

    @Operation(summary = "Retrieve all stocks with pagination")
    @GetMapping("/paged")
    public Page<Stock> findAllPaged(Pageable pageable) {
        return stockService.findAllPaged(pageable);
    }

    @Operation(summary = "Create new stock or updates an existing stock")
    @PostMapping()
    public void createStock(@RequestBody Stock stock) {
        System.out.println(stock); // NOTE: post and put here does the same thing --> if i post a stock with the same symbol, it will update the existing stock instead of giving an error
        stockService.save(stock);
    }

    // PUT endpoint for updating an existing stock
    @Operation(summary = "Updating an existing stock")
    @PutMapping
    public void updateStock(@RequestBody Stock stock) {
        stockService.save(stock);
    }

    // DELETE endpoints
    @Operation(summary = "Delete a stock by symbol")
    @DeleteMapping("/{stockSymbol}")
    public void deleteByStockSymbol(@PathVariable String stockSymbol) {
        stockService.deleteByStockSymbol(stockSymbol);
    }

    @Operation(summary = "Delete a stock by id")
    @DeleteMapping
    public void delete(@RequestBody Stock stock) {
        stockService.delete(stock);
    }

    @Operation(summary = "Calculate One Year Return of a stock based on monthly data")
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

    @Operation(summary = "Calculate One Month Return of a stock based on daily data")
    @GetMapping("/calculateOneMonthReturn")
    public ResponseEntity<Double> calculateOneMonthReturn(@RequestParam String symbol) {
        try {
            double oneMonthReturn = stockService.calculateOneMonthReturn(symbol);
            return ResponseEntity.ok(oneMonthReturn);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @Operation(summary = "Calculate One Week Return of a stock based on daily data")
    @GetMapping("/calculateOneWeekReturn")
    public ResponseEntity<Double> calculateOneWeekReturn(@RequestParam String symbol) {
        try {
            double oneWeekReturn = stockService.calculateOneWeekReturn(symbol);
            return ResponseEntity.ok(oneWeekReturn);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @Operation(summary = "Calculate One Day Return of a stock based on current data")
    @GetMapping("/calculateOneDayReturn")
    public ResponseEntity<Double> calculateOneDayReturn(@RequestParam String symbol) {
        try {
            double oneDayReturn = stockService.calculateYesterdayReturn(symbol);
            return ResponseEntity.ok(oneDayReturn);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }

    @Operation(summary = "Get one year's worth of data for a stock on monthly data")
    @GetMapping("/oneYearData")
    public ResponseEntity<List<Map<String, Object>>> fetchOneYearData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneYearData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @Operation(summary = "Get one quarter's worth of data for a stock on daily data")
    @GetMapping("/oneQuarterData")
    public ResponseEntity <List<Map<String, Object>>> fetchOneQuarterData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneQuarterData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @Operation(summary = "Get one month's worth of data for a stock on daily data")
    @GetMapping("/oneMonthData")
    public ResponseEntity <List<Map<String, Object>>> fetchOneMonthData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneMonthData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @Operation(summary = "Get one week's worth of data for a stock on daily data")
    @GetMapping("/oneWeekData")
    public ResponseEntity <List<Map<String, Object>>> fetchOneWeekData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneWeekData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @Operation(summary = "Get a stock's overview data")
    @GetMapping("/overviewData")
    public ResponseEntity <JsonNode> fetchOverviewData(@RequestParam String symbol) {
        try {
            JsonNode data = marketDataService.fetchOverviewData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

}
