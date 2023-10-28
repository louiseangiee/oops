package com.oop.appa.service;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class JsonStreamProcessor {
    private Map<String, Double> stockPrices = new HashMap<>();

    public Map<String, Double> getStockPrices() {
        return stockPrices;
    }

    public Map<String, Double> processJsonStream(InputStream inputStream) throws IOException {
        JsonFactory jsonFactory = new JsonFactory();
        ObjectMapper objectMapper = new ObjectMapper(jsonFactory);
        Map<String, Double> stockPrices = new HashMap<>();

        try (JsonParser jsonParser = jsonFactory.createParser(inputStream)) {
            while (jsonParser.nextToken() != null) {
                JsonNode node = objectMapper.readTree(jsonParser);
                processNode(node, stockPrices); // Pass the map to the processNode method
            }
        }
        return stockPrices; // Return the populated map
    }

    private void processNode(JsonNode node, Map<String, Double> stockPrices) {
        if (node.has("Time Series (Daily)")) {
            JsonNode dailyData = node.get("Time Series (Daily)");
            dailyData.fields().forEachRemaining(entry -> {
                String date = entry.getKey();
                JsonNode dayData = entry.getValue();
                if (dayData.has("4. close")) {
                    double closingPrice = dayData.get("4. close").asDouble();
                    stockPrices.put(date, closingPrice);
                }
            });
        }
    }
}
