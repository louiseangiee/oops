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

        JsonNode response = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response.has("Error Message")) {
            String errorMessage = response.get("Error Message").asText();
            throw new RuntimeException(errorMessage);
        }
        return response;
    }

    public JsonNode fetchDailyData(String symbol, String outputSize) {
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL + "/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize="
                + outputSize + "&apikey=" + apiKey;

        JsonNode response = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response.has("Error Message")) {
            String errorMessage = response.get("Error Message").asText();
            throw new RuntimeException(errorMessage);
        }
        return response;
    }

    public JsonNode fetchCurrentData(String symbol) {
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL + "/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + apiKey;

        JsonNode response = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (response.has("Global Quote") && response.get("Global Quote").isEmpty()) {
            throw new RuntimeException("Global Quote data is empty for the provided symbol.");
        }

        return response;
    }

    public JsonNode fetchIntraday(String symbol, String month) {
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL
                + "/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol
                + "&interval=15min&month=" + month
                + "&outputsize=compact&apikey=" + apiKey;

        JsonNode response = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorMap(e -> new Exception("Error fetching intraday data.", e))
                .block();

        if (response.has("Error Message")) {
            String errorMessage = response.get("Error Message").asText();
            throw new RuntimeException(errorMessage);
        }
        return response;
    }

    public JsonNode fetchOverviewData(String symbol) {
        String apiKey = dotenv.get("ALPHAVANTAGE_API_KEY");
        String apiUrl = ALPHA_VANTAGE_BASE_URL + "/query?function=OVERVIEW&symbol=" + symbol + "&apikey=" + apiKey;

        JsonNode response = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorMap(e -> new Exception("Error fetching overview data.", e))
                .block();
        if (response.isEmpty()) {
            throw new IllegalArgumentException("No data found for symbol: " + symbol);
        }
        return response;
    }

}
