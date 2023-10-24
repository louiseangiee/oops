package com.oop.appa.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.oop.appa.entity.StockLookup;

public interface StockLookupRepository extends JpaRepository<StockLookup, String>{
    List<StockLookup> findAll();
}
