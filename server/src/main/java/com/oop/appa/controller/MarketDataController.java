package com.oop.appa.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.oop.appa.exception.ErrorResponse;
import com.oop.appa.service.MarketDataService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/marketData")
public class MarketDataController {
    private MarketDataService marketDataService;

    @Autowired
    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    @Operation(summary = "returns monthly time series(date, daily open, daily high, daily low, daily close, daily volume)")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/monthData")
    public ResponseEntity<?> fetchMonthData(@RequestParam String symbol) {
        try {
            JsonNode data = marketDataService.fetchMonthData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching monthly data");
            error.setDetails((e.getMessage()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "returns raw (date, daily open, daily high, daily low, daily close, daily volume)")
    @Parameter(name = "symbol", description = "stock symbol")
    @Parameter(name = "outputSize", description = "compact OR full")
    @GetMapping("/dailyData")
    public ResponseEntity<?> fetchDailyData(@RequestParam String symbol,
            @RequestParam(defaultValue = "compact") String outputSize) {
        try {
            JsonNode data = marketDataService.fetchDailyData(symbol, outputSize);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching monthly data");
            error.setDetails((e.getMessage()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Query intraday data for a month for a stock")
    @Parameter(name = "symbol", description = "stock symbol")
    @Parameter(name = "month", description = "YYYY-MM query a specific month in history")
    @GetMapping("/intraday")
    public ResponseEntity<?> fetchIntradayData(@RequestParam String symbol, @RequestParam String month) {
        try {
            JsonNode intradayData = marketDataService.fetchIntraday(symbol, month);
            return ResponseEntity.ok(intradayData);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching monthly data");
            error.setDetails((e.getMessage()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "returns today price")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/currentData")
    public ResponseEntity<?> fetchCurrentData(@RequestParam String symbol) {
        try {
            JsonNode data = marketDataService.fetchCurrentData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching monthly data");
            error.setDetails((e.getMessage()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "returns overview data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/overview")
    public ResponseEntity<?> fetchOverviewData(@RequestParam String symbol) {
        try {
            JsonNode data = marketDataService.fetchOverviewData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching monthly data");
            error.setDetails((e.getMessage()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "returns Risk-Free rate or monthly US Treasury Yield for 3 months")
    @GetMapping("/3month")
    public ResponseEntity<?> fetchThreeMonthTreasuryYield() {
        try {
            JsonNode data = marketDataService.fetchThreeMonthTreasuryYield();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching 3-month Treasury yield data");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "returns the closest stocks in the search ticker endpoint")
    @Parameter(name = "search term", description = "stock symbol to be searched")
    @GetMapping("/search")
    public ResponseEntity<?> fetchSearchTicker(@RequestParam String searchTerm) {
        try {
            JsonNode data = marketDataService.fetchSearchTicker(searchTerm);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching search ticker data");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
