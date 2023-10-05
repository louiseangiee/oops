package com.oop.appa.dao;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.oop.appa.entity.AccessLog;


public interface AccessLogRepository extends JpaRepository<AccessLog, Integer> {

    Page<AccessLog> findAll(Pageable pageable);
    Page<AccessLog> findByUserId(Integer user_id, Pageable pageable);
    
}