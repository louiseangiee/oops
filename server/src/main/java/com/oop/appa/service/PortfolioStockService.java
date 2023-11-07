package com.oop.appa.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dto.PortfolioGroupingSummary;
import com.oop.appa.dto.PortfolioStockCreationDTO;
import com.oop.appa.dto.PortfolioStockRebalancingDTO;
import com.oop.appa.dto.RebalancingTargetPercentagesDTO;
import com.oop.appa.entity.PortfolioStock;

import jakarta.transaction.Transactional;

@Service
public interface PortfolioStockService {

    // GET
    public List<PortfolioStock> findAll();

    public Page<PortfolioStock> findAllPaged(Pageable pageable);

    public List<PortfolioStock> findByPortfolioId(Integer portfolio_id);

    public PortfolioStock findByPortfolioIdAndStockSymbol(Integer portfolioId, String stockSymbol);

    // POST
    public PortfolioStock createPortfolioStock(PortfolioStockCreationDTO dto);

    @Transactional
    public void sellPortfolioStock(Integer portfolioId, String stockSymbol, Integer quantity);

    // UPDATE
    public void save(PortfolioStock stock);

    // DELETE
    public void delete(PortfolioStock portfolioStock);

    public void deleteByPortfolioIdAndStockSymbol(Integer portfolioId, String stockSymbol);

    @Transactional
    public void deleteById(int portfolioStockId);

    // Other services
    public double calculateWeightedStockReturn(Integer portfolioId, String stockSymbol);

    public double calculateStockWeight(Integer portfolioId, String stockSymbol);

    public double calculateAnnualisedReturn(Integer portfolioStockId, String stockSymbol);

    public Map<String, Map<String, Double>> calculateStockReturnsForPortfolio(Integer portfolioId);

    public Map<String, Double> calculateOverallPortfolioReturns(Integer portfolioId);

    public PortfolioGroupingSummary calculateTotalPortfolioValueByGroup(Integer portfolioId, String groupBy);

    public Long getDaysHeld(Integer portfolioStockId);

    public Map<String, Object> getPortfolioSummary(Integer portfolioId);

    public double calculatePortfolioMonthlyVolatility(Integer portfolioId);

    public double calculatePortfolioAnnualizedVolatility(Integer portfolioId);

    public double getTotalPortfolioValue(Integer portfolioId);

    public Map<String, Object> rebalancePortfolio(Integer portfolioId, String rebalancingBy,
            RebalancingTargetPercentagesDTO rebalancingTargetPercentagesDTO);

    @Transactional
    public void executeRebalancePortfolioTransactions(PortfolioStockRebalancingDTO portfolioStocksToBeAdjusted);

}
