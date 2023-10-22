package com.oop.appa.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class MarketDataService {

    private final WebClient webClient;
    private static final Dotenv dotenv = Dotenv.load();
    private static final String ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co";

    @Autowired
    public MarketDataService(WebClient webClient) {
        this.webClient = webClient;
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

    public JsonNode fetchIntraday(String symbol, String month) {
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL 
                        + "/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol 
                        + "&interval=15min&month=" + month
                        + "&outputsize=compact&apikey=" + apiKey;
    
        return webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorMap(e -> new Exception("Error fetching intraday data.", e))
                .block();
    }

    public JsonNode fetchOverviewData(String symbol){
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL + "/query?function=OVERVIEW&symbol=" + symbol + "&apikey=" + apiKey;

        return webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorMap(e -> new Exception("Error fetching overview data.", e))
                .block();
    }

}
