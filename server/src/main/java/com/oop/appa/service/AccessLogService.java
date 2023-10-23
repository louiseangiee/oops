package com.oop.appa.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
        try {
            return accessLogRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all AccessLogs service：", e);
        }
    }

    public Page<AccessLog> findAllPaged(Pageable pageable) {
        try {
            return accessLogRepository.findAll(pageable);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all AccessLogs with pagination service: ", e);
        }
 
    }

    public Page<AccessLog> findByUserId(Integer user_id, Pageable pageable) {
        try {
            return accessLogRepository.findByUserId(user_id, pageable);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        }
        catch (Exception e) {
            throw new RuntimeException("Error fetching all AccessLogs with pagination service: ", e);
        }
    }

    // POST and UPDATE
    public AccessLog save(AccessLog accessLog) {
        try {
            return accessLogRepository.save(accessLog);
        } catch (Exception e) {
            throw new RuntimeException("Error saving AccessLog service: ", e);
        }
    }

    // DELETE
    public void delete(AccessLog entity) {
        try {
            accessLogRepository.delete(entity);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting AccessLog service: ", e);
        }
    }

    public void deleteById(Integer id) {
        try {
            accessLogRepository.deleteById(id);
            return;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting AccessLog by id service: ", e);
        }
    }

}
