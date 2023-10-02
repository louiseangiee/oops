package com.oop.appa.controller;

import com.oop.appa.entity.AccessLog;
import com.oop.appa.dao.AccessLogRepository;
import com.oop.appa.service.AccessLogService;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/accessLogs")
public class AccessLogController {
    private AccessLogService accessLogService;

    @Autowired
    public AccessLogController(AccessLogService AccessLogService) {
        this.accessLogService = AccessLogService;
    }

    // GET endpoints
    @GetMapping()
    public List<AccessLog> findAll() {
        return accessLogService.findAll();
    }

    @GetMapping("/paged")
    public Page<AccessLog> findAllPaged(Pageable pageable) {
        return accessLogService.findAllPaged(pageable);
    }

    @GetMapping("/user/{user_id}")
    public Page<AccessLog> findByUserId(@PathVariable Integer user_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return accessLogService.findByUserId(user_id, pageable);
    }

    // POST endpoint for creating a new AccessLog
    @PostMapping
    public void createAccessLog(@RequestBody AccessLog AccessLog) {
        accessLogService.save(AccessLog);
    }

    // PUT endpoint for updating an existing AccessLog
    @PutMapping
    public void updateAccessLog(@RequestBody AccessLog AccessLog) {
        accessLogService.save(AccessLog);
    }

    // DELETE endpoints
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id) {
        accessLogService.deleteById(id);
    }

    @DeleteMapping
    public void delete(@RequestBody AccessLog AccessLog) {
        accessLogService.delete(AccessLog);
    }

}
