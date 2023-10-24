package com.oop.appa.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.oop.appa.entity.Portfolio;


public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {

    Page<Portfolio> findAll(Pageable pageable);

    List<Portfolio> findByUserId(Integer user_id);

    Optional<Portfolio> findById(Integer id);

    void deleteByUserId(Integer user_id);
    
}
