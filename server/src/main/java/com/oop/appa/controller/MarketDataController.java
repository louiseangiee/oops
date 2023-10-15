package com.oop.appa.controller;

import com.oop.appa.entity.MarketData;
import com.oop.appa.service.MarketDataService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketData")
public class MarketDataController {
    private MarketDataService marketDataService;

    @Autowired
    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    // GET endpoints
    @GetMapping()
    public List<MarketData> findAll() {
        return marketDataService.findAll();
    }

    @GetMapping("/paged")
    public Page<MarketData> findAllPaged(Pageable pageable) {
        return marketDataService.findAllPaged(pageable);
    }

    @GetMapping("/stock/{stock_id}")
    public Page<MarketData> findByUserId(@PathVariable String stock_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return marketDataService.findByStockId(stock_id, pageable);
    }

    // POST endpoint for creating a new MarketData
    @PostMapping
    public void createMarketData(@RequestBody MarketData MarketData) {
        marketDataService.save(MarketData);
    }

    // PUT endpoint for updating an existing MarketData
    @PutMapping
    public void updateMarketData(@RequestBody MarketData MarketData) {
        marketDataService.save(MarketData);
    }

    // DELETE endpoints
    @DeleteMapping("/{market_data_id}")
    public void deleteById(@PathVariable Integer id) {
        marketDataService.deleteById(id);
    }

    @DeleteMapping
    public void delete(@RequestBody MarketData MarketData) {
        marketDataService.delete(MarketData);
    }

    @GetMapping("/monthData")
    public ResponseEntity<String> fetchMonthData(@RequestParam String symbol) {
        try {
            String data = marketDataService.fetchMonthData(symbol).toString();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching month adjusted data: " + e.getMessage());
        }
    }

    @GetMapping("/dailyData")
    public ResponseEntity<String> fetchDailyData(@RequestParam String symbol, @RequestParam String outputSize) {
        try {
            String data = marketDataService.fetchDailyData(symbol, outputSize).toString();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching daily adjusted data: " + e.getMessage());
        }
    }

    @GetMapping("/currentData")
    public ResponseEntity<String> fetchCurrentData(@RequestParam String symbol) {
        try {
            String data = marketDataService.fetchCurrentData(symbol).toString();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching daily adjusted data: " + e.getMessage());
        }
    }

}
