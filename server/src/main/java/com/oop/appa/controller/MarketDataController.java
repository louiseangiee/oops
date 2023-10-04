package com.oop.appa.controller;

import com.oop.appa.entity.MarketData;
import com.oop.appa.service.MarketDataService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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
    public Page<MarketData> findByUserId(@PathVariable String stock_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return marketDataService.findByStockId(stock_id, pageable);
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
