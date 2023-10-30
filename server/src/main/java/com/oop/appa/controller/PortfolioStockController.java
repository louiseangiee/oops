package com.oop.appa.controller;

import com.oop.appa.dto.PortfolioGroupingSummary;
import com.oop.appa.dto.PortfolioStockCreationDTO;
import com.oop.appa.dto.RebalancingTargetPercentagesDTO;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.exception.ErrorResponse;
import com.oop.appa.service.PortfolioStockService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/portfolioStocks")
public class PortfolioStockController {
    private PortfolioStockService portfolioStockService;

    @Autowired
    public PortfolioStockController(PortfolioStockService portfolioStockService) {
        this.portfolioStockService = portfolioStockService;
    }

    // GET
    @Operation(summary = "Retrieve all portfolio stocks")
    @GetMapping("/")
    public ResponseEntity<?> findAllPortfolioStocks() {
        try {
            List<PortfolioStock> portfolios = portfolioStockService.findAll();
            return ResponseEntity.ok(portfolios);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all portfolio stocks");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Retrieve all portfolio stocks by portfolio id")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @GetMapping("/{portfolioId}")
    public ResponseEntity<?> findByPortfolioId(@PathVariable Integer portfolioId) {
        try {
            List<PortfolioStock> portfolioStocks = portfolioStockService.findByPortfolioId(portfolioId);
            return ResponseEntity.ok(portfolioStocks);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all portfolio stocks by portfolio id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get an existing portfolio's portfolio stock by stock symbol")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}")
    public ResponseEntity<?> findByPortfolioIdAndStockSymbol(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            PortfolioStock portfolioStock = portfolioStockService.findByPortfolioIdAndStockSymbol(portfolioId,
                    stockSymbol);
            return ResponseEntity.ok(portfolioStock);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching portfolio stock by stock symbol");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // POST
    @Operation(summary = "Create a new portfolio stock")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @PostMapping("/{portfolioId}")
    public ResponseEntity<?> addStockToPortfolio(@PathVariable Integer portfolioId,
            @RequestBody PortfolioStockCreationDTO stockDto) {
        try {
            PortfolioStock portfolioStock = portfolioStockService.createPortfolioStock(stockDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(portfolioStock);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error creating a new portfolio stock");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Get Rebalancing options for a portfolio by portfolio id")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "rebalanceType", description = "sector or exchange or industry or country")
    @PostMapping("/{portfolioId}/rebalance")
    public ResponseEntity<?> getRebalancingOptions(@PathVariable Integer portfolioId,
            @RequestParam String rebalanceType,
            @RequestBody RebalancingTargetPercentagesDTO rebalancingTargetPercentagesDTO) {
        try {
            Map<String, Object> rebalancingOptions = portfolioStockService.rebalancePortfolio(portfolioId,
                    rebalanceType, rebalancingTargetPercentagesDTO);
            return ResponseEntity.ok(rebalancingOptions);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching rebalancing options");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Sell a portfolio stock by portfolio id and stock symbol and quantity to sell")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @Parameter(name = "quantity", description = "quantity to sell")
    @PutMapping("/{portfolioId}/stocks/{stockSymbol}/sell")
    public ResponseEntity<?> sellStock(@PathVariable Integer portfolioId, @PathVariable String stockSymbol,
            @RequestParam Integer quantity) {
        try {
            portfolioStockService.sellPortfolioStock(portfolioId, stockSymbol, quantity);
            return ResponseEntity.ok("Success in selling stocks");
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error selling portfolio stock by stock symbol");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Delete
    @Operation(summary = "Delete a portfolio stock by id")
    @Parameter(name = "id", description = "portfolio id")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePortfolioStockById(@PathVariable Integer id) {
        try {
            portfolioStockService.deleteById(id);
            return ResponseEntity.ok("Portfolio stock with ID " + id + " was successfully deleted.");

        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting portfolio stock by id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Drop a portfolio stock by portfolio id and stock symbol")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @DeleteMapping("/{portfolioId}/stocks/{stockSymbol}/drop")
    public ResponseEntity<?> deletePortfolioStockByPortfolioIdAndStockSymbol(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            portfolioStockService.deleteByPortfolioIdAndStockSymbol(portfolioId, stockSymbol);
            return ResponseEntity.ok("Portfolio stock with portfolio ID " + portfolioId + " and stock symbol "
                    + stockSymbol + " was successfully deleted.");

        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting portfolio stock by portfolio id and stock symbol");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Other endpoints
    @Operation(summary = "Get the weight of a specific stock within a portfolio")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}/weight")
    public ResponseEntity<?> getStockWeight(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            double stockWeight = portfolioStockService.calculateStockWeight(portfolioId, stockSymbol);
            return ResponseEntity.ok(stockWeight);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error calculating stock weight");
            error.setDetails(e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @Operation(summary = "Calculate weighted return of a stock in a portfolio by portfolio id and stock symbol")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "stockSymbol", description = "stock symbol")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}/calculateWeightedReturn")
    public ResponseEntity<?> calculateWeightedStockReturn(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            double weightedReturn = portfolioStockService.calculateWeightedStockReturn(portfolioId, stockSymbol);
            return ResponseEntity.ok(weightedReturn);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error calculating weighted return");
            error.setDetails(e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @Operation(summary = "Annualised return of a stock in a portfolio by portfolio id and stock symbol")
    @Parameter(name = "portfolioStockId", description = "portfolio stock id")
    @GetMapping("/{portfolioId}/stocks/{stockSymbol}/calculateAnnualisedReturn")
    public ResponseEntity<?> calculateAnnualisedReturn(@PathVariable Integer portfolioId,
            @PathVariable String stockSymbol) {
        try {
            double annualisedReturn = portfolioStockService.calculateAnnualisedReturn(portfolioId, stockSymbol);
            return ResponseEntity.ok(annualisedReturn);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error calculating annualised return");
            error.setDetails(e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @Operation(summary = "Groups the portfolio stocks into a sector and returns a map of the Stock, its actual value and percentage of the portfolio")
    @Parameter(name = "portfolioId", description = "portfolio id")
    @Parameter(name = "groupBy", description = "group by 'sector', 'industry' or 'exchange' or 'country'")
    @GetMapping("/{portfolioId}/stocks")
    public ResponseEntity<?> getPortfolioStocksByGroup(@PathVariable Integer portfolioId,
            @RequestParam String groupBy) {
        try {
            PortfolioGroupingSummary portfolioStocksBySector = portfolioStockService
                    .calculateTotalPortfolioValueByGroup(portfolioId, groupBy);
            return ResponseEntity.ok(portfolioStocksBySector);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error getting portfolio stocks by sector");
            error.setDetails(e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @Operation(summary = "Get the monthly volatility of a portfolio")
    @GetMapping("/{portfolioId}/volatility")
    public ResponseEntity<Double> getPortfolioMonthlyVolatility(@PathVariable Integer portfolioId) {
        try {
            double volatility = portfolioStockService.calculatePortfolioMonthlyVolatility(portfolioId);
            return ResponseEntity.ok(volatility);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @Operation(summary = "Get the annualized volatility of a portfolio")
    @GetMapping("/{portfolioId}/volatility/annualized")
    public ResponseEntity<Double> getPortfolioAnnualizedVolatility(@PathVariable Integer portfolioId) {
        try {
            double volatility = portfolioStockService.calculatePortfolioAnnualizedVolatility(portfolioId);
            return ResponseEntity.ok(volatility);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // @Operation(summary = "Retrieve the total value of a given portfolio")
    // @Parameter(name = "portfolioId", description = "portfolio id")
    // @GetMapping("/{portfolioId}/value")
    // public ResponseEntity<?> getPortfolioTotalValue(@PathVariable Integer
    // portfolioId) {
    // try {
    // double portfolioValue =
    // portfolioStockService.getTotalPortfolioValue(portfolioId);
    // return ResponseEntity.ok(portfolioValue);
    // } catch (Exception e) {
    // ErrorResponse error = new ErrorResponse();
    // error.setMessage("Error calculating total portfolio value");
    // error.setDetails(e.getMessage());
    // return ResponseEntity.internalServerError().body(error);
    // }
    // }

    // @Operation(summary = "Retrieve the stock returns for a given portfolio in
    // actual value and percentage")
    // @Parameter(name = "portfolioId", description = "portfolio id")
    // @GetMapping("/{portfolioId}/stock-returns")
    // public ResponseEntity<?> getStockReturnsForPortfolio(@PathVariable Integer
    // portfolioId) {
    // try {
    // Map<String, Map<String, Double>> stockReturns =
    // portfolioStockService.calculateStockReturnsForPortfolio(portfolioId);
    // return ResponseEntity.ok(stockReturns);
    // } catch (Exception e) {
    // ErrorResponse error = new ErrorResponse();
    // error.setMessage("Error calculating stock returns for the portfolio");
    // error.setDetails(e.getMessage());
    // return ResponseEntity.internalServerError().body(error);
    // }
    // }

    // @Operation(summary = "Retrieve the overall returns for a given portfolio in
    // actual value and percentage")
    // @Parameter(name = "portfolioId", description = "portfolio id")
    // @GetMapping("/{portfolioId}/overall-returns")
    // public ResponseEntity<?> getPortfolioOverallReturns(@PathVariable Integer
    // portfolioId) {
    // try {
    // Map<String, Double> overallReturns =
    // portfolioStockService.calculateOverallPortfolioReturns(portfolioId);
    // return ResponseEntity.ok(overallReturns);
    // } catch (Exception e) {
    // ErrorResponse error = new ErrorResponse();
    // error.setMessage("Error calculating overall portfolio returns");
    // error.setDetails(e.getMessage());
    // return ResponseEntity.internalServerError().body(error);
    // }
    // }

    @GetMapping("/{portfolioId}/summary")
    public ResponseEntity<?> getPortfolioSummary(@PathVariable Integer portfolioId) {
        try {
            double totalPortfolioValue = portfolioStockService.getTotalPortfolioValue(portfolioId);
            Map<String, Map<String, Double>> stockReturns = portfolioStockService
                    .calculateStockReturnsForPortfolio(portfolioId);
            Map<String, Double> overallReturns = portfolioStockService.calculateOverallPortfolioReturns(portfolioId);

            Map<String, Object> response = new HashMap<>();
            response.put("totalPortfolioValue", totalPortfolioValue);
            response.put("stockReturns", stockReturns);
            response.put("overallReturns", overallReturns);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving portfolio summary");
        }
    }

}
