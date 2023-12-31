package com.oop.appa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.oop.appa.entity.AccessLog;

import jakarta.transaction.Transactional;

@Service
public interface AccessLogService {

    // GET
    public List<AccessLog> findAll();

    public Page<AccessLog> findAllPaged(Pageable pageable);

    public List<AccessLog> findByUserId(Integer user_id);

    public Page<AccessLog> findByUserIdPaged(Integer user_id, Pageable pageable);

    public Page<AccessLog> findByUserIdAndPortfolioIdPaged(Integer userId, Integer portfolioId, Pageable pageable);

    // POST and UPDATE
    @Transactional
    public AccessLog save(AccessLog accessLog);

    // DELETE
    @Transactional
    public void delete(AccessLog entity);

    @Transactional
    public void deleteById(Integer id);

}
