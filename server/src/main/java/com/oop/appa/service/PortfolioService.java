package com.oop.appa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oop.appa.dao.PortfolioRepository;
import com.oop.appa.entity.Portfolio;

@Service
public class PortfolioService {
    private PortfolioRepository portfolioRepository;

    @Autowired
    public PortfolioService(PortfolioRepository portfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }

    // GET
    public List<Portfolio> findAll() {
        return portfolioRepository.findAll();
    }

    public Page<Portfolio> findAllPaged(org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable pageable) {
        return portfolioRepository.findAll(pageable);
    }

    // POST and UPDATE
    public void save(Portfolio portfolio) {
        portfolioRepository.save(portfolio);
    }

    // DELETE
    public void delete(Portfolio entity) {
        portfolioRepository.delete(entity);
    }

    public void deleteById(Integer id) {
        portfolioRepository.deleteById(id);
    }

}
