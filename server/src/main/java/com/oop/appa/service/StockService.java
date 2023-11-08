package com.oop.appa.service;

import java.io.InputStream;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.StreamSupport;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
    public StockService(StockRepository stockRepository, MarketDataService marketDataService,
            StockLookupRepository stockLookupRepository) {
        this.stockRepository = stockRepository;
        this.marketDataService = marketDataService;
        this.stockLookupRepository = stockLookupRepository;
    }

    // GET
    public List<Stock> findAll() {
        try {
            return stockRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all stocks service: ", e);
        }
    }

    public Page<Stock> findAllPaged(Pageable pageable) {
        try {
            return stockRepository.findAll(pageable);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all stocks with pagination service: ", e);
        }
    }

    public Optional<Stock> findBySymbol(String symbol) {
        try {
            return stockRepository.findById(symbol);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock by stock symbol service: ", e);
        }
    }

    public List<StockLookup> findAllStockLookups() {
        return stockLookupRepository.findAll();
    }

    // POST and UPDATE
    public Stock save(Stock stock) {
        try {
            return stockRepository.save(stock);
        } catch (Exception e) {
            throw new RuntimeException("Error saving stock service: ", e);
        }
    }

    public List<Map<String, String>> searchBar(String searchTerm) {
        try {
            JsonNode searchResults = marketDataService.fetchSearchTicker(searchTerm).path("bestMatches");
            List<Map<String, String>> results = new ArrayList<>();
            String regex = "^[A-Za-z]+$";

            for (JsonNode node : searchResults) {
                String symbol = node.path("1. symbol").asText();
                String name = node.path("2. name").asText();
                String type = node.path("3. type").asText();

                if (symbol.matches(regex) && !symbol.isEmpty() && !name.isEmpty() && type.equals("Equity")) {
                    Map<String, String> result = new HashMap<>();
                    result.put("symbol", symbol);
                    result.put("name", name);
                    results.add(result);
                }
            }
            if (results.size() == 0) {
                return new ArrayList<>();
            }
            return results;
        } catch (Exception e) {
            throw new RuntimeException("Error for search bar service: ", e);
        }
    }

    public Stock saveByStockSymbol(String stockSymbol) {
        try {
            JsonNode stockInfo = marketDataService.fetchOverviewData(stockSymbol);
            Stock stock = new Stock();
            stock.setStockSymbol(stockInfo.path("Symbol").asText());
            stock.setName(stockInfo.path("Name").asText());
            stock.setCountry(stockInfo.path("Country").asText());
            stock.setSector(stockInfo.path("Sector").asText());
            stock.setIndustry(stockInfo.path("Industry").asText());
            stock.setExchange(stockInfo.path("Exchange").asText());
            return stockRepository.save(stock);
        } catch (Exception e) {
            throw new RuntimeException("Error saving stock by stock symbol service: ", e);
        }
    }

    // DELETE
    public void delete(Stock stock) {
        try {
            stockRepository.delete(stock);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting stock service: " + e.getMessage(), e);
        }
    }

    public void deleteByStockSymbol(String stockSymbol) {
        try {
            stockRepository.deleteById(stockSymbol); // ID is the stock symbol
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting stock by stock symbol service: " + e.getMessage(), e);
        }
    }

    // Others
    public double calculateOneYearReturn(String stockSymbol) {
        try {
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
                    .orElseThrow(() -> new RuntimeException("No data found for the date prefix: " + oneYearAgoPrefix));
            double oneYearAgoClose = yearlyTimeSeries.path(matchingKey).path("4. close").asDouble();
            double oneYearReturn = (currentClose - oneYearAgoClose) / oneYearAgoClose;
            return oneYearReturn;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating one year return service: " + e.getMessage(), e);
        }
    }

    public double calculateOneMonthReturn(String stockSymbol) {
        try {
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
                    .orElseThrow(() -> new RuntimeException("No data found for the date prefix: " + oneMonthAgoPrefix));
            double oneMonthAgoClose = monthlyTimeSeries.path(matchingKey).path("4. close").asDouble();
            double oneMonthReturn = (currentClose - oneMonthAgoClose) / oneMonthAgoClose;
            return oneMonthReturn;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating one month return service: " + e.getMessage(), e);
        }
    }

    public double calculateOneWeekReturn(String stockSymbol) {
        try {
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
                    .orElseThrow(
                            () -> new RuntimeException("No data found for the date prefix: " + getDateOneWeekAgo()));
            double specificDateClose = dailyTimeSeries.path(matchingKey).path("4. close").asDouble();
            double specificDateReturn = (currentClose - specificDateClose) / specificDateClose;
            return specificDateReturn;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating one week return service: " + e.getMessage(), e);
        }

    }

    public double calculateYesterdayReturn(String stockSymbol) {
        try {
            JsonNode currentData = marketDataService.fetchCurrentData(stockSymbol);
            JsonNode globalQuote = currentData.path("Global Quote");
            double currentClose = globalQuote.path("05. price").asDouble();
            double yesterdayClose = globalQuote.path("08. previous close").asDouble();
            double yesterdayReturn = (currentClose - yesterdayClose) / yesterdayClose;
            return yesterdayReturn;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating yesterday return service:  " + e.getMessage(), e);
        }

    }

    @Cacheable(value = "oneYearData", key = "#stockSymbol")
    public List<Map<String, Object>> fetchOneYearData(String stockSymbol) {
        try {
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
        } catch (Exception e) {
            throw new RuntimeException("Error fetching one year data service: " + e.getMessage(), e);
        }

    }

    public List<Map<String, Object>> fetchOneQuarterData(String stockSymbol) {
        try {
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
        } catch (Exception e) {
            throw new RuntimeException("Error fetching one quarter data service: " + e.getMessage(), e);
        }

    }

    public List<Map<String, Object>> fetchOneMonthData(String stockSymbol) {
        try {
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
        } catch (Exception e) {
            throw new RuntimeException("Error fetching one month data service: " + e.getMessage(), e);
        }

    }

    public List<Map<String, Object>> fetchOneWeekData(String stockSymbol) {
        try {
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
        } catch (Exception e) {
            throw new RuntimeException("Error fetching one week data service: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> fetchStockPriceAtDate(String stockSymbol, String stringDate) {
        try {
            LocalDate date = LocalDate.parse(stringDate);
            if (date.isAfter(LocalDate.now())) {
                throw new IllegalArgumentException("Date cannot be in the future: " + stringDate);
            }
            InputStream responseStream = marketDataService.fetchDailyDataStream(stockSymbol, "full");
            JsonStreamProcessor processor = new JsonStreamProcessor();
            Map<String, Double> stockPrices = processor.processJsonStream(responseStream);
            Map<String, Object> result = new HashMap<>();
            String message;

            for (int i = 0; i < 10; i++) {
                System.out.println("Checking for price on " + date.toString());
                Double price = stockPrices.get(date.toString());

                if (price != null) {
                    result.put("date", date.toString());
                    result.put("price", price);
                    if (date.equals(LocalDate.parse(stringDate))) {
                        message = "Exact date match found.";
                    } else if (date.equals(LocalDate.now())) {
                        message = "Date selected was today and data was available.";
                    } else if (date.equals(LocalDate.now().minusDays(1))) {
                        message = "Date selected was today and data was not available. Closest date match found.";
                    } else {
                        message = "Date selected was a weekend or a bank holiday. Closest date match found.";
                    }
                    result.put("message", message);
                    return result;
                } else {
                    if (date.getDayOfWeek() == DayOfWeek.MONDAY) {
                        date = date.minusDays(3);
                    } else {
                        date = date.minusDays(1);
                    }
                }
            }
            return result;

        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + stringDate, e);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock price at date service: " + e.getMessage(), e);
        }
    }

    public Map<String, Double> calculateMonthlyVolatility(String stockSymbol) {
        Map<String, Double> monthlyVolatilities = new HashMap<>();
        try {
            List<Map<String, Object>> monthlyData = fetchOneYearData(stockSymbol);

            List<Double> monthlyClosingPrices = monthlyData.stream()
                    .map(dataPoint -> Double.parseDouble(dataPoint.get("4. close").toString()))
                    .collect(Collectors.toList());

            List<Double> monthlyReturns = new ArrayList<>();
            for (int i = 1; i < monthlyClosingPrices.size(); i++) {
                double monthlyReturn = (monthlyClosingPrices.get(i) - monthlyClosingPrices.get(i - 1))
                        / monthlyClosingPrices.get(i - 1);
                monthlyReturns.add(monthlyReturn);
            }

            double mean = monthlyReturns.stream().mapToDouble(val -> val).average().orElse(0.0);
            double variance = monthlyReturns.stream().mapToDouble(val -> Math.pow(val - mean, 2)).sum()
                    / monthlyReturns.size();

            double monthlyVolatility = Math.sqrt(variance);
            monthlyVolatilities.put(stockSymbol, monthlyVolatility);
            return monthlyVolatilities;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating monthly volatility service: " + e.getMessage(), e);
        }
    }

    @Cacheable(value = "annualizedVolatility", key = "#stockSymbol")
    public Map<String, Double> calculateAnnualizedVolatility(String stockSymbol) {
        Map<String, Double> annualizedVolatilities = new HashMap<>();

        try {
            List<Map<String, Object>> monthlyData = fetchOneYearData(stockSymbol);
            int dataSize = monthlyData.size();
            List<Double> monthlyReturns = new ArrayList<>(dataSize);
            double sum = 0.0;
            double currentClose, previousClose = Double.parseDouble((String) monthlyData.get(0).get("4. close"));

            for (int i = 1; i < dataSize; i++) {
                currentClose = Double.parseDouble((String) monthlyData.get(i).get("4. close"));
                double monthlyReturn = (currentClose - previousClose) / previousClose;
                monthlyReturns.add(monthlyReturn);
                sum += monthlyReturn;
                previousClose = currentClose;
            }

            double mean = sum / dataSize;
            double variance = 0.0;

            for (double monthlyReturn : monthlyReturns) {
                variance += Math.pow(monthlyReturn - mean, 2);
            }
            variance /= dataSize;

            double monthlyVolatility = Math.sqrt(variance);
            double annualizedVolatility = monthlyVolatility * Math.sqrt(12);

            annualizedVolatilities.put(stockSymbol, annualizedVolatility);
            return annualizedVolatilities;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating annualized volatility service: " + e.getMessage(), e);
        }
    }

    public Map<String, Double> fetchStockPricesUpToPeriod(String stockSymbol, String period) {
        try {
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = getStartDateForPeriod(endDate, period);
            InputStream responseStream;
            if (period.equals("year")) {
                responseStream = marketDataService.fetchDailyDataStream(stockSymbol, "full");
            } else {
                responseStream = marketDataService.fetchDailyDataStream(stockSymbol, "compact");
            }
            JsonStreamProcessor processor = new JsonStreamProcessor();
            Map<String, Double> stockPrices = processor.processJsonStream(responseStream);
            Map<String, Double> result = new TreeMap<>(); // Use TreeMap instead of HashMap

            // Stream dates from start date to end date and add prices to result
            Stream.iterate(startDate, date -> date.plusDays(1))
                    .limit(ChronoUnit.DAYS.between(startDate, endDate) + 1)
                    .forEach(date -> {
                        Double price = stockPrices.get(date.toString());
                        if (price != null) {
                            result.put(date.toString(), price);
                        }
                    });
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock prices up to period: " + e.getMessage(), e);
        }
    }

    private LocalDate getStartDateForPeriod(LocalDate referenceDate, String period) {
        switch (period.toLowerCase()) {
            case "year":
                return referenceDate.minusYears(1);
            case "quarter":
                return referenceDate.minusMonths(3);
            case "month":
                return referenceDate.minusMonths(1);
            case "week":
                return referenceDate.minusWeeks(1);
            default:
                throw new IllegalArgumentException("Invalid time period: " + period);
        }
    }

    // Helper functions
    String getDateOneYearAgo(boolean isEndOfMonth) {
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);
        return isEndOfMonth ? oneYearAgo.with(TemporalAdjusters.lastDayOfMonth()).toString() : oneYearAgo.toString();
    }

    private String getDateThreeMonthsAgo(boolean isEndOfMonth) {
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        return isEndOfMonth ? threeMonthsAgo.with(TemporalAdjusters.lastDayOfMonth()).toString()
                : threeMonthsAgo.toString();
    }

    private static String getDateOneMonthAgo(boolean isEndOfMonth) {
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        return isEndOfMonth ? oneMonthAgo.with(TemporalAdjusters.lastDayOfMonth()).toString() : oneMonthAgo.toString();
    }

    private static String getDateOneWeekAgo() {
        LocalDate oneWeekAgo = LocalDate.now().minusWeeks(1);
        return oneWeekAgo.toString();
    }
}
