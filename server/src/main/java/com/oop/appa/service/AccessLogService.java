package com.oop.appa.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oop.appa.dao.AccessLogRepository;
import com.oop.appa.entity.AccessLog;

@Service
public class AccessLogService {
    
    private AccessLogRepository accessLogRepository;

    @Autowired
    public AccessLogService(AccessLogRepository accessLogRepository) {
        this.accessLogRepository = accessLogRepository;
    }

    // GET
    public List<AccessLog> findAll() {
        return accessLogRepository.findAll();
    }

    public Page<AccessLog> findAllPaged(Pageable pageable) {
        return accessLogRepository.findAll(pageable);
    }

    public Page<AccessLog> findByUserId(Integer user_id, Pageable pageable) {
        return accessLogRepository.findByUserId(user_id, pageable);
    }

    // POST and UPDATE
    public void save(AccessLog accessLog) {
        accessLogRepository.save(accessLog);
    }

    // DELETE
    public void delete(AccessLog entity) {
        accessLogRepository.delete(entity);
    }

    public void deleteById(Integer id) {
        accessLogRepository.deleteById(id);
    }

}

