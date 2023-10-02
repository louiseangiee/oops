package com.oop.appa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oop.appa.dao.PerformanceMetricsRepository;
import com.oop.appa.entity.PerformanceMetrics;

@Service
public class PerformanceMetricsService {
    
    private PerformanceMetricsRepository performanceMetricsRepository;

    @Autowired
    public PerformanceMetricsService(PerformanceMetricsRepository performanceMetricsRepository) {
        this.performanceMetricsRepository = performanceMetricsRepository;
    }

    // GET
    public List<PerformanceMetrics> findAll() {
        return performanceMetricsRepository.findAll();
    }

    public Page<PerformanceMetrics> findAllPaged(Pageable pageable) {
        return performanceMetricsRepository.findAll(pageable);
    }

    public List<PerformanceMetrics> findByPortfolioId(Integer portfolio_id) {
        return performanceMetricsRepository.findByPortfolioId(portfolio_id);
    }

    // POST and UPDATE
    public void save(PerformanceMetrics performanceMetrics) {
        performanceMetricsRepository.save(performanceMetrics);
    }

    // DELETE
    public void delete(PerformanceMetrics performanceMetrics) {
        performanceMetricsRepository.delete(performanceMetrics);
    }

    public void deleteById(Integer id) {
        performanceMetricsRepository.deleteById(id);
    }
}
