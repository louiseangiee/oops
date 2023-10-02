package com.oop.appa.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.oop.appa.entity.MarketData;

public interface MarketDataRepository extends JpaRepository<MarketData, Integer> {
    Page<MarketData> findAll(Pageable pageable);
    Page<MarketData> findByStockId(String stock_id, Pageable pageable);
}
