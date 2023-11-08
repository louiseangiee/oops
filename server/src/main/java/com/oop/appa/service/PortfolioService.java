package com.oop.appa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.dto.PortfolioCreationDTO;
import com.oop.appa.entity.Portfolio;

import jakarta.transaction.Transactional;

@Service
public interface PortfolioService {


    public List<Portfolio> findAll();

    public Page<Portfolio> findAllPaged(Pageable pageable);
    
    public List<Portfolio> findByUserId(Integer user_id);

    public Optional<Portfolio> findById(Integer id);

    public Portfolio findByUserIdPortfolioId(Integer user_id, Integer portfolio_id);

    // POST
    @Transactional
    public Portfolio createPortfolio(PortfolioCreationDTO portfolioDto);

    // UPDATE
    @Transactional
    public Portfolio updatePortfolio(Integer portfolioId, Portfolio portfolio);
    
    // DELETE
    @Transactional
    public void deleteById(Integer id);

    @Transactional
    public void deleteByUserId(Integer user_id);
}
