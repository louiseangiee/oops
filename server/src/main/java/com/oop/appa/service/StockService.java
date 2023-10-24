package com.oop.appa.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Spliterator;
import java.util.Spliterators;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.json.JSONObject;
import java.util.stream.StreamSupport;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.util.function.Function;

import com.fasterxml.jackson.databind.JsonNode;
import com.oop.appa.dao.StockLookupRepository;
import com.oop.appa.dao.StockRepository;
import com.oop.appa.entity.Stock;
import com.oop.appa.entity.StockLookup;

@Service
@Transactional // Adding @Transactional annotation to handle transactions at the service layer.
public class StockService {

    private final StockRepository stockRepository;
    private final MarketDataService marketDataService;
    private final StockLookupRepository stockLookupRepository;

    @Autowired
    public StockService(StockRepository stockRepository, MarketDataService marketDataService, StockLookupRepository stockLookupRepository) {
        this.stockRepository = stockRepository;
        this.marketDataService = marketDataService;
        this.stockLookupRepository = stockLookupRepository;
    }

    // GET
    public List<Stock> findAll() {
        return stockRepository.findAll();
    }

    public Page<Stock> findAllPaged(Pageable pageable) {
        return stockRepository.findAll(pageable);
    }

    public List<StockLookup> findAllStockLookups() {
        return stockLookupRepository.findAll();
    }

    // POST and UPDATE
    public Stock save(Stock stock) {
        return stockRepository.save(stock);
    }

    // DELETE
    public void delete(Stock stock) {
        stockRepository.delete(stock);
    }

    public void deleteByStockSymbol(String stockSymbol) {
        stockRepository.deleteById(stockSymbol); // ID is the stock symbol
    }

    public Optional<Stock> findBySymbol(String symbol) {
        return stockRepository.findById(symbol);
    }

    public double calculateOneYearReturn(String stockSymbol) {
        JsonNode yearlyJson = marketDataService.fetchMonthData(stockSymbol);
        JsonNode currentJson = marketDataService.fetchCurrentData(stockSymbol);
        double currentClose = currentJson.path("Global Quote").path("05. price").asDouble();
        String oneYearAgoPrefix = getDateOneYearAgo(true).substring(0, 7);
        JsonNode yearlyTimeSeries = yearlyJson.path("Monthly Time Series");
        List<String> keys = StreamSupport.stream(
                Spliterators.spliteratorUnknownSize(yearlyTimeSeries.fieldNames(), Spliterator.ORDERED),
                false)
                .collect(Collectors.toList());
        String matchingKey = keys.stream()
                .filter(key -> key.compareTo(oneYearAgoPrefix) <= 0)
                .findFirst()
                .orElse(null);
        double oneYearAgoClose = matchingKey != null ? yearlyTimeSeries.path(matchingKey).path("4. close").asDouble()
                : 0.0;
        double oneYearReturn = (currentClose - oneYearAgoClose) / oneYearAgoClose;
        return oneYearReturn;
    }

    public double calculateOneMonthReturn(String stockSymbol) {
        JsonNode monthlyJson = marketDataService.fetchMonthData(stockSymbol);
        JsonNode currentJson = marketDataService.fetchCurrentData(stockSymbol);
        double currentClose = currentJson.path("Global Quote").path("05. price").asDouble();
        String oneMonthAgoPrefix = getDateOneMonthAgo(true).substring(0, 7); // e.g., "2023-09"
        JsonNode monthlyTimeSeries = monthlyJson.path("Monthly Time Series");
        List<String> keys = StreamSupport.stream(
                Spliterators.spliteratorUnknownSize(monthlyTimeSeries.fieldNames(), Spliterator.ORDERED),
                false)
                .collect(Collectors.toList());
        String matchingKey = keys.stream()
                .filter(key -> key.startsWith(oneMonthAgoPrefix))
                .findFirst()
                .orElse(null);
        double oneMonthAgoClose = matchingKey != null ? monthlyTimeSeries.path(matchingKey).path("4. close").asDouble()
                : 0.0;
        double oneMonthReturn = (currentClose - oneMonthAgoClose) / oneMonthAgoClose;
        return oneMonthReturn;
    }

    public double calculateOneWeekReturn(String stockSymbol) {
        JsonNode dailyJson = marketDataService.fetchDailyData(stockSymbol, "compact");
        JsonNode currentJson = marketDataService.fetchCurrentData(stockSymbol);
        double currentClose = currentJson.path("Global Quote").path("05. price").asDouble();
        JsonNode dailyTimeSeries = dailyJson.path("Time Series (Daily)");
        List<String> keys = StreamSupport.stream(
                Spliterators.spliteratorUnknownSize(dailyTimeSeries.fieldNames(), Spliterator.ORDERED),
                false)
                .collect(Collectors.toList());
        // Find the closest available date before the desired date
        String matchingKey = keys.stream()
                .filter(key -> key.compareTo(getDateOneWeekAgo()) <= 0) // Dates before or equal to the desired date
                .findFirst()
                .orElse(null);
        double specificDateClose = matchingKey != null ? dailyTimeSeries.path(matchingKey).path("4. close").asDouble()
                : 0.0;
        double specificDateReturn = (currentClose - specificDateClose) / specificDateClose;
        return specificDateReturn;
    }

    public double calculateYesterdayReturn(String stockSymbol) {
        JsonNode currentData = marketDataService.fetchCurrentData(stockSymbol);
        JsonNode globalQuote = currentData.path("Global Quote");
        double currentClose = globalQuote.path("05. price").asDouble();
        double yesterdayClose = globalQuote.path("08. previous close").asDouble();
        double yesterdayReturn = (currentClose - yesterdayClose) / yesterdayClose;
        return yesterdayReturn;
    }

    public List<Map<String, Object>> fetchOneYearData(String stockSymbol) {
        JsonNode yearlyJson = marketDataService.fetchMonthData(stockSymbol);
        String oneYearAgoPrefix = getDateOneYearAgo(true).substring(0, 7); // e.g., "2022-09"
        JsonNode yearlyTimeSeries = yearlyJson.path("Monthly Time Series");

        List<String> keys = StreamSupport.stream(
                Spliterators.spliteratorUnknownSize(yearlyTimeSeries.fieldNames(), Spliterator.ORDERED),
                false)
                .collect(Collectors.toList());

        List<String> filteredKeys = keys.stream()
                .filter(key -> key.compareTo(oneYearAgoPrefix) >= 0)
                .collect(Collectors.toList());

        List<Map<String, Object>> dataPoints = filteredKeys.stream()
                .map(key -> {
                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("date", key);
                    dataPoint.put("4. close", yearlyTimeSeries.path(key).path("4. close").asText());
                    return dataPoint;
                })
                .collect(Collectors.toList());

        return dataPoints;
    }

    public List<Map<String, Object>> fetchOneQuarterData(String stockSymbol) {
        JsonNode quarterlyJson = marketDataService.fetchDailyData(stockSymbol, "compact");
        String threeMonthsAgoDate = getDateThreeMonthsAgo(false); // e.g., "2023-07-15"
        System.out.println(threeMonthsAgoDate);
        JsonNode quarterlyTimeSeries = quarterlyJson.path("Time Series (Daily)");
    
        List<String> keys = StreamSupport.stream(
                Spliterators.spliteratorUnknownSize(quarterlyTimeSeries.fieldNames(), Spliterator.ORDERED),
                false)
                .collect(Collectors.toList());
    
        List<String> filteredKeys = keys.stream()
                .filter(key -> key.compareTo(threeMonthsAgoDate) >= 0) // Filter dates after three months ago
                .collect(Collectors.toList());
    
        List<Map<String, Object>> dataPoints = filteredKeys.stream()
                .map(key -> {
                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("date", key);
                    dataPoint.put("4. close", quarterlyTimeSeries.path(key).path("4. close").asText());
                    return dataPoint;
                })
                .collect(Collectors.toList());
    
        return dataPoints;
    }
    
    private String getClosestAvailableDate(JsonNode dailyTimeSeries, String initialDate) {
        LocalDate targetDate = LocalDate.parse(initialDate);
        for (int i = 0; i < 10; i++) {  // 10 is just an arbitrary limit to avoid infinite loops
            if (dailyTimeSeries.has(targetDate.toString())) {
                return targetDate.toString();  // Found a valid data point
            }
            targetDate = targetDate.plusDays(1);  // Move to the next day
        }
        return initialDate;  // Return the initial date if no valid date is found within the limit
    }
    
    public List<Map<String, Object>> fetchOneMonthData(String stockSymbol) {
        JsonNode monthlyJson = marketDataService.fetchDailyData(stockSymbol, "compact");
        String oneMonthAgoDate = getDateOneMonthAgo(false); // e.g., "2023-09-15"
        JsonNode monthlyTimeSeries = monthlyJson.path("Time Series (Daily)");
    
        List<String> keys = StreamSupport.stream(
                Spliterators.spliteratorUnknownSize(monthlyTimeSeries.fieldNames(), Spliterator.ORDERED),
                false)
                .collect(Collectors.toList());
    
        List<String> filteredKeys = keys.stream()
                .filter(key -> key.compareTo(oneMonthAgoDate) >= 0) // Filter dates after one month ago
                .collect(Collectors.toList());
    
        List<Map<String, Object>> dataPoints = filteredKeys.stream()
                .map(key -> {
                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("date", key);
                    dataPoint.put("4. close", monthlyTimeSeries.path(key).path("4. close").asText());
                    return dataPoint;
                })
                .collect(Collectors.toList());
    
        return dataPoints;
    }

    public List<Map<String, Object>> fetchOneWeekData(String stockSymbol) {
        JsonNode dailyJson = marketDataService.fetchDailyData(stockSymbol, "compact");
        String oneWeekAgoDate = getDateOneWeekAgo(); // e.g., "2023-09-15"
        JsonNode dailyTimeSeries = dailyJson.path("Time Series (Daily)");

        List<String> keys = StreamSupport.stream(
                Spliterators.spliteratorUnknownSize(dailyTimeSeries.fieldNames(), Spliterator.ORDERED),
                false)
                .collect(Collectors.toList());

        List<String> filteredKeys = keys.stream()
                .filter(key -> key.compareTo(oneWeekAgoDate) >= 0) // Filter dates after one week ago
                .collect(Collectors.toList());

        List<Map<String, Object>> dataPoints = filteredKeys.stream()
                .map(key -> {
                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("date", key);
                    dataPoint.put("4. close", dailyTimeSeries.path(key).path("4. close").asText());
                    return dataPoint;
                })
                .collect(Collectors.toList());

        return dataPoints;
    }
    
    private String getDateOneYearAgo(boolean isEndOfMonth) {
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);
        return isEndOfMonth ? oneYearAgo.with(TemporalAdjusters.lastDayOfMonth()).toString() : oneYearAgo.toString();
    }
    
    private String getDateThreeMonthsAgo(boolean isEndOfMonth) {
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        return isEndOfMonth ? threeMonthsAgo.with(TemporalAdjusters.lastDayOfMonth()).toString() : threeMonthsAgo.toString();
    }
    
    public static String getDateOneMonthAgo(boolean isEndOfMonth) {
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        return isEndOfMonth ? oneMonthAgo.with(TemporalAdjusters.lastDayOfMonth()).toString() : oneMonthAgo.toString();
    }
    
    public static String getDateOneWeekAgo() {
        LocalDate oneWeekAgo = LocalDate.now().minusWeeks(1);
        return oneWeekAgo.toString();
    }
    
    public static String getCurrentDate() {
        LocalDate today = LocalDate.now();
        return today.toString();
    }
    
    public double calculateDailyVolatility(String stockSymbol) {
        List<Map<String, Object>> dataPoints = fetchOneMonthData(stockSymbol);

        // Extract closing prices from the data
        List<Double> closingPrices = dataPoints.stream()
            .map(dataPoint -> Double.parseDouble(dataPoint.get("4. close").toString()))
            .collect(Collectors.toList());

        // Calculate daily returns
        List<Double> dailyReturns = new ArrayList<>();
        for (int i = 1; i < closingPrices.size(); i++) {
            double dailyReturn = (closingPrices.get(i) - closingPrices.get(i - 1)) / closingPrices.get(i - 1);
            dailyReturns.add(dailyReturn);
        }

        // Calculate standard deviation of daily returns
        double mean = dailyReturns.stream().mapToDouble(val -> val).average().orElse(0.0);
        double variance = dailyReturns.stream().mapToDouble(val -> Math.pow(val - mean, 2)).sum() / dailyReturns.size();
        double volatility = Math.sqrt(variance);

        return volatility;
    }

    public double calculateMonthlyVolatility(String stockSymbol) {
        // 1. Fetch the data
        List<Map<String, Object>> monthlyData = fetchOneYearData(stockSymbol);
    
        // 2. Extract the monthly closing prices
        List<Double> monthlyClosingPrices = monthlyData.stream()
              .map(dataPoint -> Double.parseDouble(dataPoint.get("4. close").toString()))
              .collect(Collectors.toList());
    
        // 3. Calculate monthly returns
        List<Double> monthlyReturns = new ArrayList<>();
        for (int i = 1; i < monthlyClosingPrices.size(); i++) {
            double monthlyReturn = (monthlyClosingPrices.get(i) - monthlyClosingPrices.get(i - 1)) / monthlyClosingPrices.get(i - 1);
            monthlyReturns.add(monthlyReturn);
        }
    
        // 4. Compute the monthly volatility
        double mean = monthlyReturns.stream().mapToDouble(val -> val).average().orElse(0.0);
        double variance = monthlyReturns.stream().mapToDouble(val -> Math.pow(val - mean, 2)).sum() / monthlyReturns.size();
    
        return Math.sqrt(variance);
    }
    
    public double calculateAnnualizedVolatility(String stockSymbol) {
        List<Map<String, Object>> monthlyData = fetchOneYearData(stockSymbol);
    
        // Calculate monthly returns
        List<Double> monthlyReturns = new ArrayList<>();
        for (int i = 1; i < monthlyData.size(); i++) {
            double previousClose = Double.parseDouble((String) monthlyData.get(i - 1).get("4. close"));
            double currentClose = Double.parseDouble((String) monthlyData.get(i).get("4. close"));
            double monthlyReturn = (currentClose - previousClose) / previousClose;
            monthlyReturns.add(monthlyReturn);
        }
    
        // Calculate standard deviation of monthly returns
        double mean = monthlyReturns.stream().mapToDouble(val -> val).average().orElse(0.0);
        double variance = monthlyReturns.stream().mapToDouble(val -> Math.pow(val - mean, 2)).sum() / monthlyReturns.size();
        double monthlyVolatility = Math.sqrt(variance);
    
        // Annualize the volatility
        // Since we're using monthly data and there are roughly 12 months in a year, the sqrt value changes to 12.
        double annualizedVolatility = monthlyVolatility * Math.sqrt(12); 
    
        return annualizedVolatility;
    }
    
}
