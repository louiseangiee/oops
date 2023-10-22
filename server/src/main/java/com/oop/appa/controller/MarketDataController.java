package com.oop.appa.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.oop.appa.service.MarketDataService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    public ResponseEntity<JsonNode> fetchMonthData(@RequestParam String symbol) {
        try {
            JsonNode data = marketDataService.fetchMonthData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode errorNode = mapper.createObjectNode().put("error", "Error fetching Intraday data: " + e.getMessage());
            return ResponseEntity.status(500).body(errorNode);
        }
    }

    @Operation(summary = "returns raw (date, daily open, daily high, daily low, daily close, daily volume)")
    @Parameter(name = "outputSize", description = "compact OR full")
    @GetMapping("/dailyData")
    public ResponseEntity<JsonNode> fetchDailyData(@RequestParam String symbol, @RequestParam(defaultValue = "compact") String outputSize) {
        try {
            JsonNode data = marketDataService.fetchDailyData(symbol, outputSize);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode errorNode = mapper.createObjectNode().put("error", "Error fetching Intraday data: " + e.getMessage());
            return ResponseEntity.status(500).body(errorNode);
        }
    }

    @Operation(summary = "Query intraday data for a month for a stock")
    @Parameter(name = "month", description = "YYYY-MM query a specific month in history")
    @GetMapping("/intraday")
     public ResponseEntity<JsonNode> fetchIntradayData(@RequestParam String symbol, @RequestParam String month) {
        try {
            JsonNode intradayData = marketDataService.fetchIntraday(symbol, month);
            return ResponseEntity.ok(intradayData);
        } catch (Exception e) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode errorNode = mapper.createObjectNode().put("error", "Error fetching Intraday data: " + e.getMessage());
            return ResponseEntity.status(500).body(errorNode);
        }
    }

    @Operation(summary = "returns today price")
    @GetMapping("/currentData")
    public ResponseEntity<JsonNode> fetchCurrentData(@RequestParam String symbol) {
        try {
            JsonNode data = marketDataService.fetchCurrentData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode errorNode = mapper.createObjectNode().put("error", "Error fetching overview data: " + e.getMessage());
            return ResponseEntity.status(500).body(errorNode);
        }
    }

    @Operation(summary = "returns overview data")
    @GetMapping("/overview")
    public ResponseEntity<JsonNode> fetchOverviewData(@RequestParam String symbol) {
        try {
            JsonNode data = marketDataService.fetchOverviewData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode errorNode = mapper.createObjectNode().put("error", "Error fetching overview data: " + e.getMessage());
            return ResponseEntity.status(500).body(errorNode);
        }
    }

}
