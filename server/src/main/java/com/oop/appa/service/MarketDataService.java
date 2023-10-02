package com.oop.appa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oop.appa.dao.MarketDataRepository;
import com.oop.appa.entity.MarketData;

@Service
public class MarketDataService {
    
    private MarketDataRepository marketDataRepository;

    @Autowired
    public MarketDataService(MarketDataRepository marketDataRepository) {
        this.marketDataRepository = marketDataRepository;
    }

    // GET
    public List<MarketData> findAll() {
        return marketDataRepository.findAll();
    }

    public Page<MarketData> findAllPaged(Pageable pageable) {
        return marketDataRepository.findAll(pageable);
    }

    public Page<MarketData> findByStockId(Integer stock_id, Pageable pageable) {
        return marketDataRepository.findByStockId(stock_id, pageable);
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

}

