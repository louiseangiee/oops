package com.oop.appa.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oop.appa.entity.Stock;
import com.oop.appa.entity.StockLookup;

@Service
@Transactional // Adding @Transactional annotation to handle transactions at the service layer.
public interface StockService {
    // GET
    public List<Stock> findAll();

    public Page<Stock> findAllPaged(Pageable pageable);

    public Optional<Stock> findBySymbol(String symbol);

    public List<StockLookup> findAllStockLookups();

    // POST and UPDATE
    public Stock save(Stock stock);

    public List<Map<String, String>> searchBar(String searchTerm);

    public Stock saveByStockSymbol(String stockSymbol);

    // DELETE
    public void delete(Stock stock);

    public void deleteByStockSymbol(String stockSymbol);

    // Others
    public double calculateOneYearReturn(String stockSymbol);

    public double calculateOneMonthReturn(String stockSymbol);

    public double calculateOneWeekReturn(String stockSymbol);

    public double calculateYesterdayReturn(String stockSymbol);

    public List<Map<String, Object>> fetchOneYearData(String stockSymbol);

    public List<Map<String, Object>> fetchOneQuarterData(String stockSymbol);

    // Unused?
    // private String getClosestAvailableDate(JsonNode dailyTimeSeries, String
    // initialDate) {
    // LocalDate targetDate = LocalDate.parse(initialDate);
    // for (int i = 0; i < 10; i++) { // 10 is just an arbitrary limit to avoid
    // infinite loops
    // if (dailyTimeSeries.has(targetDate.toString())) {
    // return targetDate.toString(); // Found a valid data point
    // }
    // targetDate = targetDate.plusDays(1); // Move to the next day
    // }
    // return initialDate; // Return the initial date if no valid date is found
    // within the limit
    // }

    public List<Map<String, Object>> fetchOneMonthData(String stockSymbol);

    public List<Map<String, Object>> fetchOneWeekData(String stockSymbol);

    public Map<String, Object> fetchStockPriceAtDate(String stockSymbol, String stringDate);
    
    public double calculateDailyVolatility(String stockSymbol);

    public double calculateMonthlyVolatility(String stockSymbol);

    public double calculateAnnualizedVolatility(String stockSymbol);
    
}
