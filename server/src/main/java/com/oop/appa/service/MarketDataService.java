package com.oop.appa.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.JsonNode;

import com.oop.appa.dao.MarketDataRepository;
import com.oop.appa.entity.MarketData;

@Service
public class MarketDataService {

    private MarketDataRepository marketDataRepository;
    private final WebClient webClient;
    private static final Dotenv dotenv = Dotenv.load();
    private static final String ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co";

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

    public JsonNode fetchMonthData(String symbol) {
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL + "/query?function=TIME_SERIES_MONTHLY&symbol=" + symbol + "&apikey="
                + apiKey;

        return webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorMap(e -> new Exception("Error fetching monthly data.", e))
                .block();
    }

    public JsonNode fetchDailyData(String symbol, String outputSize) {
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL + "/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize="
                + outputSize + "&apikey=" + apiKey;

        return webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorMap(e -> new Exception("Error fetching monthly data.", e))
                .block();
    }

    public JsonNode fetchCurrentData(String symbol) {
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL + "/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + apiKey;

        return webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorMap(e -> new Exception("Error fetching monthly data.", e))
                .block();
    }

}
