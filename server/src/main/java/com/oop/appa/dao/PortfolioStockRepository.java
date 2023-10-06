package com.oop.appa.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.oop.appa.entity.PortfolioStock;

public interface PortfolioStockRepository extends JpaRepository<PortfolioStock, Integer> {
    Page<PortfolioStock> findAll(Pageable pageable);
}
