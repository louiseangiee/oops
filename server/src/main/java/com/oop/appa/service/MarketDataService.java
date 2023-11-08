package com.oop.appa.service;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.io.IOException;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public interface MarketDataService {

    public JsonNode fetchMonthData(String symbol);

    public JsonNode fetchDailyData(String symbol, String outputSize);

    public JsonNode fetchCurrentData(String symbol);

    public JsonNode fetchIntraday(String symbol, String month);

    public JsonNode fetchOverviewData(String symbol);

    public JsonNode fetchThreeMonthTreasuryYield();

    public JsonNode fetchSearchTicker(String searchTerm);

    public InputStream fetchDailyDataStream(String stockSymbol, String outputSize);

}
