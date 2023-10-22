package com.oop.appa.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.oop.appa.service.MarketDataService;

import io.swagger.v3.oas.annotations.Operation;

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

    @Operation(summary = "returns monthly time series(date, daily open, daily high, daily low, daily close, daily volume)")
    @GetMapping("/monthData")
    public ResponseEntity<String> fetchMonthData(@RequestParam String symbol) {
        try {
            String data = marketDataService.fetchMonthData(symbol).toString();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching month adjusted data: " + e.getMessage());
        }
    }

    @Operation(summary = "returns raw (as-traded) daily time series (date, daily open, daily high, daily low, daily close, daily volume)")
    @GetMapping("/dailyData")
    public ResponseEntity<String> fetchDailyData(@RequestParam String symbol, @RequestParam(defaultValue = "compact") String outputSize) {
        try {
            String data = marketDataService.fetchDailyData(symbol, outputSize).toString();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching daily adjusted data: " + e.getMessage());
        }
    }

    @Operation(summary = "You can use the month parameter (in YYYY-MM format) to query a specific month in history")
    @GetMapping("/intraday")
     public ResponseEntity<JsonNode> fetchIntradayData(@RequestParam String symbol, @RequestParam String month) {
        try {
            JsonNode intradayData = marketDataService.fetchIntraday(symbol, month);
            return ResponseEntity.ok(intradayData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @Operation(summary = "returns today price")
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
