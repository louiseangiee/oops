package com.oop.appa.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oop.appa.dao.StockRepository;
import com.oop.appa.entity.Stock;

@Service
@Transactional // Adding @Transactional annotation to handle transactions at the service layer.
public class StockService {

    private final StockRepository stockRepository;

    @Autowired
    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    // GET
    public List<Stock> findAll() {
        return stockRepository.findAll();
    }

    public Page<Stock> findAllPaged(Pageable pageable) {
        return stockRepository.findAll(pageable);
    }

    // POST and UPDATE
    public void save(Stock stock) {
        stockRepository.save(stock);
    }

    // DELETE
    public void delete(Stock stock) {
        stockRepository.delete(stock);
    }

    public void deleteByStockSymbol(String stockSymbol) {
        stockRepository.deleteById(stockSymbol); // ID is the stock symbol
    }

}
