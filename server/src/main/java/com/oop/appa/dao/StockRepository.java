package com.oop.appa.dao;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.oop.appa.entity.Stock;

public interface StockRepository extends JpaRepository<Stock, String> {

    Page<Stock> findAll(Pageable pageable);
    
}
