package com.oop.appa.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oop.appa.entity.Stock;
import com.oop.appa.entity.StockLookup;

@Service
@Transactional
public interface StockService {

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

    @Cacheable(value = "oneYearData", key = "#stockSymbol")
    public List<Map<String, Object>> fetchOneYearData(String stockSymbol);

    public List<Map<String, Object>> fetchOneQuarterData(String stockSymbol);

    public List<Map<String, Object>> fetchOneMonthData(String stockSymbol);

    public List<Map<String, Object>> fetchOneWeekData(String stockSymbol);

    public Map<String, Object> fetchStockPriceAtDate(String stockSymbol, String stringDate);

    public Map<String, Double> calculateMonthlyVolatility(String stockSymbol);

    @Cacheable(value = "annualizedVolatility", key = "#stockSymbol")
    public Map<String, Double> calculateAnnualizedVolatility(String stockSymbol);

    public Map<String, Double> fetchStockPricesUpToPeriod(String stockSymbol, String period);
}
