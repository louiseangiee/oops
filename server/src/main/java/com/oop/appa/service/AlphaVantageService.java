package com.oop.appa.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AlphaVantageService {

    private static final String ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co";
    private static final String API_KEY = "demo";  // Replace with your real API key if you have one

    private final WebClient webClient;

    @Autowired
    public AlphaVantageService(WebClient webClient) {
        this.webClient = webClient;
    }

    // public String searchSymbolByKeyword(String keyword) {
    //     String apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=" + symbol + "&apikey=demo";
    //     return webClient.get()
    //         .uri(uriBuilder -> uriBuilder
    //             .path(ALPHA_VANTAGE_API_URL)
    //             .queryParam("function", "SYMBOL_SEARCH")
    //             .queryParam("keywords", keyword)
    //             .queryParam("apikey", API_KEY)
    //             .build())
    //         .retrieve()
    //         .bodyToMono(String.class)
    //         .block();  // This will make the call synchronous
    // }

    // http://localhost:8080/api/search/symbol/tesco
    public String searchSymbolByKeyword(String keyword) {
        String apiUrl = ALPHA_VANTAGE_BASE_URL + "/query?function=SYMBOL_SEARCH&keywords=" + keyword + "&apikey=" + API_KEY;

        return webClient.get()
                        .uri(apiUrl)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();  // This will make the call synchronous
    }
}
