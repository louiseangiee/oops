package com.oop.appa.controller;

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
    public ResponseEntity<String> fetchDailyData(@RequestParam String symbol, @RequestParam(defaultValue = "compact") String outputSize) {
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
