package com.oop.appa.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dao.PerformanceMetricsRepository;
import com.oop.appa.entity.PerformanceMetrics;

@Service
public class PerformanceMetricsService {
    // nnti paling ngitung ulangnya cek kalo dateCalculated field sama real timenya itu beda hari ato ga, 
    // kalo beda hari recalculate by calling AlphaVantage API. 
    // kalo masi sama harinya just use the same data stored in this table
    // gw gtw ini mending bandingin tanggalnya itu di frontend ato disini 
    
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
    
    public List<PerformanceMetrics> findByPortfolioId(Integer portfolioId) {
        return performanceMetricsRepository.findByPortfolioPortfolioId(portfolioId);
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
