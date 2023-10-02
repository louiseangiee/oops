package com.oop.appa.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.oop.appa.entity.PerformanceMetrics;

public interface PerformanceMetricsRepository extends JpaRepository<PerformanceMetrics, Integer> {
    // Additional query method (if needed) can be defined here
    Page<PerformanceMetrics> findAll(Pageable pageable);

    List<PerformanceMetrics> findByPortfolioId(Integer portfolio_id);
}
