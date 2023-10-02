package com.oop.appa.controller;

import com.oop.appa.entity.PerformanceMetrics;
import com.oop.appa.service.PerformanceMetricsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/performanceMetrics")
public class PerformanceMetricsController {

    private PerformanceMetricsService performanceMetricsService;

    @Autowired
    public PerformanceMetricsController(PerformanceMetricsService performanceMetricsService) {
        this.performanceMetricsService = performanceMetricsService;
    }

    // GET endpoints
    @GetMapping()
    public List<PerformanceMetrics> findAll() {
        return performanceMetricsService.findAll();
    }

    @GetMapping("/paged")
    public Page<PerformanceMetrics> findAllPaged(Pageable pageable) {
        return performanceMetricsService.findAllPaged(pageable);
    }

    @GetMapping("/portfolio/{portfolio_id}")
    public List<PerformanceMetrics> findByPortfolioId(@PathVariable Integer portfolio_id) {
        return performanceMetricsService.findByPortfolioId(portfolio_id);
    }

    // POST endpoint for creating a new performance metric
    @PostMapping
    public void createPerformanceMetric(@RequestBody PerformanceMetrics performanceMetrics) {
        performanceMetricsService.save(performanceMetrics);
    }

    // PUT endpoint for updating an existing performance metric
    @PutMapping
    public void updatePerformanceMetric(@RequestBody PerformanceMetrics performanceMetrics) {
        performanceMetricsService.save(performanceMetrics);
    }

    // DELETE endpoints
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id) {
        performanceMetricsService.deleteById(id);
    }

    @DeleteMapping
    public void delete(@RequestBody PerformanceMetrics performanceMetrics) {
        performanceMetricsService.delete(performanceMetrics);
    }
}
