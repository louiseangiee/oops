package com.oop.appa.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oop.appa.entity.PerformanceMetrics;

public interface PerformanceMetricsRepository extends JpaRepository<PerformanceMetrics, Integer> {
    List<PerformanceMetrics> findByPortfolioPortfolioId(Integer portfolioId);
}
