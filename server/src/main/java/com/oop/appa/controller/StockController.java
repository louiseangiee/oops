package com.oop.appa.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.oop.appa.entity.Stock;
import com.oop.appa.entity.StockLookup;
import com.oop.appa.exception.ErrorResponse;
import com.oop.appa.service.MarketDataService;
import com.oop.appa.service.StockService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
        this.marketDataService = marketDataService;
    }

    @Operation(summary = "Retrieve all stocks")
    @GetMapping()
    public ResponseEntity<?> findAll() {
        try {
            List<Stock> stock = stockService.findAll();
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all stocks");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Retrieve all stock lookups")
    @GetMapping("/stocklookup")
    public List<StockLookup> findAllStockLookups() {
        return stockService.findAllStockLookups();
    }

    @Operation(summary = "Retrieve all stocks with pagination")
    @Parameter(name = "pageable", description = "pagination object")
    @GetMapping("/paged")
    public ResponseEntity<?> findAllPaged(Pageable pageable) {
        try {
            Page<Stock> stocks = stockService.findAllPaged(pageable);
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all stocks with pagination");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Create new stock or updates an existing stock")
    @Parameter(name = "stock", description = "stock object")
    @PostMapping()
    public ResponseEntity<?> createStock(@RequestBody Stock stock) {
        try {
            stockService.save(stock);
            return ResponseEntity.status(HttpStatus.CREATED).body(stock);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error creating stock");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Retrieve a stock by stock symbol")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @PostMapping("/addByStockSymbol")
    public ResponseEntity<?> addByStockSymbol(@RequestParam String stockSymbol) {
        try {
            Stock stock = stockService.saveByStockSymbol(stockSymbol);
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error adding stock by stock symbol.");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // PUT endpoint for updating an existing stock
    @Operation(summary = "Updating an existing stock")
    @Parameter(name = "stock", description = "stock object")
    @PutMapping
    public ResponseEntity<?> updateStock(@RequestBody Stock stock) {
        try {
            stockService.save(stock);
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error updating stock");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // DELETE endpoints
    @Operation(summary = "Delete a stock by symbol")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @DeleteMapping("/{stockSymbol}")
    public ResponseEntity<?> deleteByStockSymbol(@PathVariable String stockSymbol) {
        try {
            stockService.deleteByStockSymbol(stockSymbol);
            return ResponseEntity.ok("Stock deleted");
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting stock");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Calculate One Year Return of a stock based on monthly data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/calculateOneYearReturn")
    public ResponseEntity<?> calculateOneYearReturn(@RequestParam String symbol) {
        try {
            double oneYearReturn = stockService.calculateOneYearReturn(symbol);
            return ResponseEntity.ok(oneYearReturn);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in calculating one year return");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Calculate One Month Return of a stock based on daily data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/calculateOneMonthReturn")
    public ResponseEntity<?> calculateOneMonthReturn(@RequestParam String symbol) {
        try {
            double oneMonthReturn = stockService.calculateOneMonthReturn(symbol);
            return ResponseEntity.ok(oneMonthReturn);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in calculating one month return");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Calculate One Week Return of a stock based on daily data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/calculateOneWeekReturn")
    public ResponseEntity<?> calculateOneWeekReturn(@RequestParam String symbol) {
        try {
            double oneWeekReturn = stockService.calculateOneWeekReturn(symbol);
            return ResponseEntity.ok(oneWeekReturn);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in calculating one week return");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Calculate One Day Return of a stock based on current data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/calculateOneDayReturn")
    public ResponseEntity<?> calculateOneDayReturn(@RequestParam String symbol) {
        try {
            double oneDayReturn = stockService.calculateYesterdayReturn(symbol);
            return ResponseEntity.ok(oneDayReturn);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in calculating one day return");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get one year's worth of data for a stock on monthly data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/oneYearData")
    public ResponseEntity<?> fetchOneYearData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneYearData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in getting one year's worth of data using monthly data");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get one quarter's worth of data for a stock on daily data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/oneQuarterData")
    public ResponseEntity<?> fetchOneQuarterData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneQuarterData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in getting one quarter's worth of data using daily data");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get one month's worth of data for a stock on daily data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/oneMonthData")
    public ResponseEntity<?> fetchOneMonthData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneMonthData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in getting one month's worth of data using daily data");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get one week's worth of data for a stock on daily data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/oneWeekData")
    public ResponseEntity<?> fetchOneWeekData(@RequestParam String symbol) {
        try {
            List<Map<String, Object>> data = stockService.fetchOneWeekData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in calculating one week's worth of data using daily data");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get daily volatility of a stock")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/calculateDailyVolatility")
    public ResponseEntity<?> calculateDailyVolatility(@RequestParam String symbol) {
        try {
            double volatility = stockService.calculateDailyVolatility(symbol);
            return ResponseEntity.ok(volatility);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in calculating daily volatility");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get weekly volatility of a stock")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/calculateMonthlyVolatility")
    public ResponseEntity<?> calculateMonthlyVolatility(@RequestParam String symbol) {
        try {
            double volatility = stockService.calculateMonthlyVolatility(symbol);
            return ResponseEntity.ok(volatility);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in calculating monthly volatility");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get annualized volatility of a stock")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/calculateAnnualizedVolatility")
    public ResponseEntity<?> calculateAnnualizedVolatility(@RequestParam String symbol) {
        try {
            double annualizedVolatility = stockService.calculateAnnualizedVolatility(symbol);
            return ResponseEntity.ok(annualizedVolatility);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in calculating annualized volatility");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get a stock's overview data")
    @Parameter(name = "symbol", description = "stock symbol")
    @GetMapping("/overviewData")
    public ResponseEntity<?> fetchOverviewData(@RequestParam String symbol) {
        try {
            JsonNode data = marketDataService.fetchOverviewData(symbol);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in fetching overview data");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Search bar end point")
    @Parameter(name = "searchTerm", description = "search term")
    @GetMapping("/search")
    public ResponseEntity<?> searchBar(@RequestParam String searchTerm) {
        try {
            List<Map<String, String>> data = stockService.searchBar(searchTerm);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in fetching search ticker data");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get a stock's price at a specific date")
    @Parameter(name = "symbol", description = "stock symbol")
    @Parameter(name = "date", description = "date in yyyy-mm-dd format")
    @GetMapping("/priceAtDate")
    public ResponseEntity<?> fetchPriceAtDate(@RequestParam String symbol, @RequestParam String date) {
        try {
            Map<String,Object> price = stockService.fetchStockPriceAtDate(symbol, date);
            return ResponseEntity.ok(price);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error in fetching price at date");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
}
