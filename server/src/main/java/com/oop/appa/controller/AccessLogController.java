package com.oop.appa.controller;

import com.oop.appa.dto.AccessLogDTO;
import com.oop.appa.entity.AccessLog;
import com.oop.appa.service.AccessLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<AccessLogDTO> findAll() {
        List<AccessLog> accessLogs = accessLogService.findAll();
        return accessLogs.stream().map(AccessLogDTO::new).collect(Collectors.toList());
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
