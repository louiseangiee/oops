package com.oop.appa.service;

import java.io.InputStream;
import org.springframework.stereotype.Service;
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

    public InputStream fetchDailyDataStream(String stockSymbol, String outputSize) throws IOException;
}
