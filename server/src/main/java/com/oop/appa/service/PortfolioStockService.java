package com.oop.appa.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dao.AccessLogRepository;
import com.oop.appa.dao.PortfolioStockRepository;
import com.oop.appa.dto.PortfolioGroupingSummary;
import com.oop.appa.dto.PortfolioStockCreationDTO;
import com.oop.appa.dto.PortfolioStockRebalancingDTO;
import com.oop.appa.dto.RebalancingTargetPercentagesDTO;
import com.oop.appa.entity.AccessLog;
import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.PortfolioStock;
import com.oop.appa.entity.Stock;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public interface PortfolioStockService {
    // GET
    public List<PortfolioStock> findAll();

    public Page<PortfolioStock> findAllPaged(Pageable pageable);

    public List<PortfolioStock> findByPortfolioId(Integer portfolio_id);

    public PortfolioStock findByPortfolioIdAndStockSymbol(Integer portfolioId, String stockSymbol);

    // POST
    @Transactional
    public PortfolioStock createPortfolioStock(PortfolioStockCreationDTO dto);

    @CacheEvict(value = "portfolioVolatility", key = "#portfolioId")
    public void clearPortfolioVolatilityCache(Integer portfolioId);

    @Transactional
    public void sellPortfolioStock(Integer portfolioId, String stockSymbol, Integer quantity);
    // UPDATE
    @Transactional
    public void save(PortfolioStock stock);
    // DELETE
    @Transactional
    public void delete(PortfolioStock portfolioStock);

    public void deleteByPortfolioIdAndStockSymbol(Integer portfolioId, String stockSymbol);

    @Transactional
    public void deleteById(int portfolioStockId);

    // Other services
    public Map<String,Double> calculateWeightedStockReturn(Integer portfolioId, String stockSymbol);

    public Map<String,Double> calculateStockWeight(Integer portfolioId, String stockSymbol);

    public Map<String,Double> calculateAnnualisedReturn(Integer portfolioStockId, String stockSymbol);

    public Map<String, Map<String, Double>> calculateStockReturnsForPortfolio(Integer portfolioId);

    public Map<String, Double> calculateOverallPortfolioReturns(Integer portfolioId);

    public PortfolioGroupingSummary calculateTotalPortfolioValueByGroup(Integer portfolioId, String groupBy);

    public Long getDaysHeld(Integer portfolioStockId);

    public Map<String, Object> getPortfolioSummary(Integer portfolioId);

    @Cacheable(value = "portfolioVolatility", key = "#portfolioId")
    public Map<String, Double> calculatePortfolioMonthlyVolatility(Integer portfolioId);

    @Cacheable(value = "AnnualizedportfolioVolatility", key = "#portfolioId")
    public Map<String, Double> calculatePortfolioAnnualizedVolatility(Integer portfolioId);

    public double getTotalPortfolioValue(Integer portfolioId);

    public Map<String, Object> rebalancePortfolio(Integer portfolioId, String rebalancingBy,
            RebalancingTargetPercentagesDTO rebalancingTargetPercentagesDTO);

    @Transactional
    public Map<String, String> executeRebalancePortfolioTransactions(PortfolioStockRebalancingDTO portfolioStocksToBeAdjusted, Integer portfolioId);

}
