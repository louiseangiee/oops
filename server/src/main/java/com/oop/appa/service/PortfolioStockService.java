package com.oop.appa.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dao.AccessLogRepository;
import com.oop.appa.dao.PortfolioStockRepository;
import com.oop.appa.dto.PortfolioStockCreationDTO;
import com.oop.appa.entity.AccessLog;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.entity.Stock;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PortfolioStockService {
    private PortfolioStockRepository portfolioStockRepository;
    private MarketDataService marketDataService;
    private StockService stockService;
    private PortfolioService portfolioService;
    private AccessLogRepository accessLogRepository;

    @Autowired
    public PortfolioStockService(PortfolioStockRepository portfolioStockRepository, MarketDataService marketDataService,
            StockService stockService, PortfolioService portfolioService,
            AccessLogRepository accessLogRepository) {
        this.portfolioStockRepository = portfolioStockRepository;
        this.marketDataService = marketDataService;
        this.stockService = stockService;
        this.portfolioService = portfolioService;
        this.accessLogRepository = accessLogRepository;
    }

    // GET
    public List<PortfolioStock> findAll() {
        try {
            return portfolioStockRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all PortfolioStocks service: " + e.getMessage(), e);
        }
    }

    public Page<PortfolioStock> findAllPaged(Pageable pageable) {
        try {
            return portfolioStockRepository.findAll(pageable);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all PortfolioStocks with pagination service: " + e.getMessage(),
                    e);
        }
    }

    public List<PortfolioStock> findByPortfolioId(Integer portfolio_id) {
        try {
            return portfolioStockRepository.findByPortfolioPortfolioId(portfolio_id);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all PortfolioStocks by portfolio ID service: " + portfolio_id,
                    e);
        }
    }

    public PortfolioStock findByPortfolioIdAndStockSymbol(Integer portfolioId, String stockSymbol) {
        try {
            return portfolioStockRepository.findByPortfolioPortfolioIdAndStockStockSymbol(portfolioId, stockSymbol)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Stock " + stockSymbol + "not found in portfolio id" + portfolioId));
        } catch (Exception e) {
            throw new RuntimeException("Error fetching PortfolioStock by portfolio ID: " + portfolioId
                    + " and stock symbol: " + stockSymbol, e);
        }
    }

    // POST
    public PortfolioStock createPortfolioStock(PortfolioStockCreationDTO dto) {
        try {
            Portfolio portfolio = portfolioService.findById(dto.getPortfolioId())
                    .orElseThrow(() -> new EntityNotFoundException("Portfolio not found"));
            Stock stock = stockService.findBySymbol(dto.getSymbol())
                    .orElseThrow(() -> new EntityNotFoundException("Stock not found"));
            PortfolioStock existingPortfolioStock = portfolio.getPortfolioStocks().stream()
                    .filter(ps -> ps.getStock().getStockSymbol().equals(stock.getStockSymbol()))
                    .findFirst()
                    .orElse(null);

            String action;
            if (existingPortfolioStock != null) {
                existingPortfolioStock.setBuyPrice(dto.getBuyPrice());
                existingPortfolioStock.setQuantity(dto.getQuantity());
                action = String.format(
                        "User updated stock %s in portfolio ID: %d Name: %s with new price: %f and quantity: %d",
                        stock.getStockSymbol(), portfolio.getPortfolioId(), portfolio.getName(), dto.getBuyPrice(),
                        dto.getQuantity());
                accessLogRepository.save(new AccessLog(portfolio.getUser(), action));
                return portfolioStockRepository.save(existingPortfolioStock);
            } else {
                PortfolioStock portfolioStock = new PortfolioStock();
                portfolioStock.setStock(stock);
                portfolioStock.setBuyPrice(dto.getBuyPrice());
                portfolioStock.setQuantity(dto.getQuantity());
                portfolioStock.setBuyDate(dto.getBuyDate());
                portfolioStock.setPortfolio(portfolio);
                action = String.format("User added new stock %s to portfolio ID: %d Name: %s",
                        stock.getStockSymbol(), portfolio.getPortfolioId(), portfolio.getName());
                accessLogRepository.save(new AccessLog(portfolio.getUser(), action));
                return portfolioStockRepository.save(portfolioStock);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error creating PortfolioStock service: " + e.getMessage(), e);
        }

    }

    // UPDATE
    public void save(PortfolioStock stock) {
        try {
            portfolioStockRepository.save(stock);
        } catch (Exception e) {
            throw new RuntimeException("Error saving PortfolioStock service: " + e.getMessage(), e);
        }
    }

    // DELETE
    public void delete(PortfolioStock portfolioStock) {
        try {
            PortfolioStock portfolioStockRef = portfolioStockRepository.findById(portfolioStock.getId())
                    .orElseThrow(() -> new EntityNotFoundException("PortfolioStock not found"));
            portfolioStockRepository.delete(portfolioStock);
            String action = String.format("User deletes stock %s from portfolio ID: %d Name: %s",
                    portfolioStockRef.getStock().getStockSymbol(), portfolioStockRef.getPortfolio().getPortfolioId(),
                    portfolioStockRef.getPortfolio().getName());
            accessLogRepository.save(new AccessLog(portfolioStockRef.getPortfolio().getUser(), action));
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting PortfolioStock service: " + e.getMessage(), e);
        }
    }

    public void deleteById(int portfolioStockId) {
        try {
            PortfolioStock portfolioStock = portfolioStockRepository.findById(portfolioStockId)
                    .orElseThrow(() -> new EntityNotFoundException("PortfolioStock not found"));
            portfolioStockRepository.deleteById(portfolioStockId);
            String action = String.format("User deletes stock %s from portfolio ID: %d Name: %s",
                    portfolioStock.getStock().getStockSymbol(), portfolioStock.getPortfolio().getPortfolioId(),
                    portfolioStock.getPortfolio().getName());
            accessLogRepository.save(new AccessLog(portfolioStock.getPortfolio().getUser(), action));
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting PortfolioStock by id service: " + e.getMessage(), e);
        }
    }

    // Other services
    public double calculateWeightedStockReturn(Integer portfolioId, String stockSymbol) {
        try {
            PortfolioStock stock = findByPortfolioIdAndStockSymbol(portfolioId, stockSymbol);
            double totalReturn = 0;
            int totalQuantity = stock.getQuantity();
            double currentPrice = marketDataService.fetchCurrentData(stockSymbol).path("Global Quote")
                    .path("05. price").asDouble();
            double buyPrice = stock.getBuyPrice();
            double individualReturn = ((currentPrice - buyPrice) / buyPrice) * 100;
            totalReturn += (double) stock.getQuantity() / totalQuantity * individualReturn;
            return totalReturn;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating weighted stock return service: " + e.getMessage(), e);
        }

    }

    public double calculateStockWeight(Integer portfolioId, String stockSymbol) {
        try {
            PortfolioStock currentStock = findByPortfolioIdAndStockSymbol(portfolioId, stockSymbol);
            double currentPrice = marketDataService.fetchCurrentData(stockSymbol).path("Global Quote")
                    .path("05. price").asDouble();
            double stockMarketValue = currentStock.getQuantity() * currentPrice;
            System.out.println(stockSymbol);
            System.out.println(currentPrice);
            System.out.println(stockMarketValue);
            // You'd need a method to fetch all stocks in the portfolio to calculate the
            // total portfolio value
            double totalPortfolioValue = 0; // Total market value of all stocks in the portfolio
            List<PortfolioStock> allStocksInPortfolio = findByPortfolioId(portfolioId);
            for (PortfolioStock stock : allStocksInPortfolio) {
                double stockPrice = marketDataService.fetchCurrentData(stock.getStockSymbol()).path("Global Quote")
                        .path("05. price").asDouble();
                totalPortfolioValue += stock.getQuantity() * stockPrice;
            }
            return stockMarketValue / totalPortfolioValue;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating stock weight service: " + e.getMessage(), e);
        }

    }

    public double calculateAnnualisedReturn(Integer portfolioStockId, String stockSymbol) {
        try {
            PortfolioStock stock = portfolioStockRepository
                    .findByPortfolioPortfolioIdAndStockStockSymbol(portfolioStockId, stockSymbol).orElse(null);
            if (stock == null) {
                throw new IllegalArgumentException("PortfolioStock not found for ID: " + portfolioStockId);
            }
            double currentPrice = marketDataService.fetchCurrentData(stock.getStock().getStockSymbol())
                    .path("Global Quote")
                    .path("05. close price").asDouble();
            double buyPrice = stock.getBuyPrice();
            long days = getDaysHeld(portfolioStockId);
            return ((Math.pow((currentPrice / buyPrice), (365.0 / days))) - 1) * 100;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating annualised return service: " + e.getMessage(), e);
        }

    }

    public Map<String, Map<String, Double>> calculateTotalPortfolioValueByGroup(Integer portfolioId, String groupBy) {
        try {
            List<PortfolioStock> allStocksInPortfolio = findByPortfolioId(portfolioId);

            Map<String, Double> currentPrices = new HashMap<>();
            for (PortfolioStock stock : allStocksInPortfolio) {
                String stockSymbol = stock.getStock().getStockSymbol();
                if (!currentPrices.containsKey(stockSymbol)) {
                    double currentPrice = marketDataService.fetchCurrentData(stockSymbol)
                            .path("Global Quote").path("05. price").asDouble();
                    currentPrices.put(stockSymbol, currentPrice);
                }
            }

            double totalPortfolioValue = allStocksInPortfolio.stream()
                    .mapToDouble(stock -> stock.getQuantity() * currentPrices.get(stock.getStock().getStockSymbol()))
                    .sum();

            Function<PortfolioStock, String> groupingFunction = getGroupingFunction(groupBy);

            Map<String, Double> valueByGroup = allStocksInPortfolio.stream()
                    .collect(Collectors.groupingBy(
                            groupingFunction,
                            Collectors.summingDouble(stock -> stock.getQuantity()
                                    * currentPrices.get(stock.getStock().getStockSymbol()))));

            // Construct the result
            Map<String, Map<String, Double>> result = valueByGroup.entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            entry -> {
                                Map<String, Double> details = new HashMap<>();
                                details.put("actualValue", entry.getValue());
                                details.put("percentage", (entry.getValue() / totalPortfolioValue) * 100);
                                return details;
                            }));

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error calculating total portfolio value by sector: " + e.getMessage(), e);
        }
    }

    public Long getDaysHeld(Integer portfolioStockId) {
        try {
            PortfolioStock stock = portfolioStockRepository.findById(portfolioStockId).orElse(null);
            if (stock == null || stock.getBuyDate() == null) {
                throw new IllegalArgumentException("Invalid PortfolioStock or buy date for ID: " + portfolioStockId);
            }
            LocalDate buyDate = stock.getBuyDate();
            LocalDate currentDate = LocalDate.now();
            return ChronoUnit.DAYS.between(buyDate, currentDate);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating days held service: " + e.getMessage(), e);
        }

    }

    private Function<PortfolioStock, String> getGroupingFunction(String groupBy) {
        switch (groupBy.toLowerCase()) {
            case "sector":
                return stock -> stock.getStock().getSector();
            case "industry":
                return stock -> stock.getStock().getIndustry();
            // case "exchange":
            // // Assuming Stock has a getExchange() method. If not, adjust accordingly.
            // return stock -> stock.getStock().getExchange();
            default:
                throw new IllegalArgumentException("Unsupported groupBy value: " + groupBy);
        }
    }

    public double calculatePortfolioMonthlyVolatility(Integer portfolioId) {
        // 1. Fetch all stocks in the portfolio
        List<PortfolioStock> allStocksInPortfolio = findByPortfolioId(portfolioId); 
        // 2. For each stock, calculate its monthly volatility and weight in the portfolio
        double portfolioVolatility = 0.0;
    
        for (PortfolioStock stock : allStocksInPortfolio) {
            String stockSymbol = stock.getStockSymbol(); 
            // Calculate monthly volatility of the stock calculateMonthlyVolatility
            double stockMonthlyVolatility = stockService.calculateMonthlyVolatility(stockSymbol);
            // Calculate weight of the stock in the portfolio
            double stockWeight = calculateStockWeight(portfolioId, stockSymbol);
            // Add weighted volatility to the overall portfolio volatility
            portfolioVolatility += stockWeight * stockMonthlyVolatility;
        }
        return portfolioVolatility;
    }

    public double calculatePortfolioAnnualizedVolatility(Integer portfolioId) {
        // Get the monthly volatility for the portfolio
        double monthlyVolatility = calculatePortfolioMonthlyVolatility(portfolioId);
    
        // Annualize the volatility
        // As we're using monthly data and there are roughly 12 months in a year, we'll multiply with the square root of 12.
        double annualizedVolatility = monthlyVolatility * Math.sqrt(12); 
        return annualizedVolatility;
    }
}
