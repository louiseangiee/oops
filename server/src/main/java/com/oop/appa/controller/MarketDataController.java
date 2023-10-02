package com.oop.appa.controller;

import com.oop.appa.entity.AccessLog;
import com.oop.appa.entity.MarketData;
import com.oop.appa.dao.MarketDataRepository;
import com.oop.appa.service.MarketDataService;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/MarketData")
public class MarketDataController {
    private MarketDataService marketDataService;

    @Autowired
    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    // GET endpoints
    @GetMapping()
    public List<MarketData> findAll() {
        return marketDataService.findAll();
    }

    @GetMapping("/paged")
    public Page<MarketData> findAllPaged(Pageable pageable) {
        return marketDataService.findAllPaged(pageable);
    }

    @GetMapping("/stock/{stock_id}")
    public Page<MarketData> findByUserId(@PathVariable Integer user_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return marketDataService.findByStockId(user_id, pageable);
    }
    // POST endpoint for creating a new MarketData
    @PostMapping
    public void createMarketData(@RequestBody MarketData MarketData) {
        marketDataService.save(MarketData);
    }

    // PUT endpoint for updating an existing MarketData
    @PutMapping
    public void updateMarketData(@RequestBody MarketData MarketData) {
        marketDataService.save(MarketData);
    }

    // DELETE endpoints
    @DeleteMapping("/{market_data_id}")
    public void deleteById(@PathVariable Integer id) {
        marketDataService.deleteById(id);
    }

    @DeleteMapping
    public void delete(@RequestBody MarketData MarketData) {
        marketDataService.delete(MarketData);
    }

}
