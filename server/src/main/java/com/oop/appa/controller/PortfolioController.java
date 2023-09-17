package com.oop.appa.controller;

import com.oop.appa.entity.Portfolio;
import com.oop.appa.dao.PortfolioRepository;
import com.oop.appa.service.PortfolioService;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/portfolios")
public class PortfolioController {
    private PortfolioService portfolioService;
    
    @Autowired
    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // GET endpoints
    @GetMapping()
    public List<Portfolio> findAll() {
        return portfolioService.findAll();
    }

    @GetMapping("/paged")
    public Page<Portfolio> findAllPaged(Pageable pageable) {
        return portfolioService.findAllPaged(pageable);
    }

    // POST endpoint for creating a new portfolio
    @PostMapping
    public void createPortfolio(@RequestBody Portfolio portfolio) {
        portfolioService.save(portfolio);
    }

    // PUT endpoint for updating an existing portfolio
    @PutMapping
    public void updatePortfolio(@RequestBody Portfolio portfolio) {
        portfolioService.save(portfolio);
    }

    // DELETE endpoints
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id) {
        portfolioService.deleteById(id);
    }

    @DeleteMapping
    public void delete(@RequestBody Portfolio portfolio) {
        portfolioService.delete(portfolio);
    }

}
