package com.oop.appa.dao;

import java.util.List;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.oop.appa.entity.Portfolio;


public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {

    Page<Portfolio> findAll(Pageable pageable);
    
}
