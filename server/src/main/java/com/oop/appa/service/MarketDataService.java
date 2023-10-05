package com.oop.appa.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.oop.appa.dao.MarketDataRepository;
import com.oop.appa.entity.MarketData;

@Service
public class MarketDataService {
    
    private MarketDataRepository marketDataRepository;
    private final WebClient webClient;

    @Autowired
    public MarketDataService(MarketDataRepository marketDataRepository, WebClient webClient) {
        this.marketDataRepository = marketDataRepository;
        this.webClient = webClient;
    }

    // GET
    public List<MarketData> findAll() {
        return marketDataRepository.findAll();
    }

    public Page<MarketData> findAllPaged(Pageable pageable) {
        return marketDataRepository.findAll(pageable);
    }

    public Page<MarketData> findByStockId(String stock_id, Pageable pageable) {
        return marketDataRepository.findByStockStockSymbol(stock_id, pageable);
    }

    // POST and UPDATE
    public void save(MarketData marketData) {
        marketDataRepository.save(marketData);
    }

    // DELETE
    public void delete(MarketData entity) {
        marketDataRepository.delete(entity);
    }

    public void deleteById(Integer id) {
        marketDataRepository.deleteById(id);
    }

    public String fetchMonthAdjustedData(String symbol) {
        String apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=" + symbol + "&apikey=demo";
        
        return webClient.get()
                        .uri(apiUrl)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();  // This will make the call synchronous
    }

}

