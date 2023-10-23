package com.oop.appa.controller;

import com.oop.appa.dto.AccessLogDTO;
import com.oop.appa.entity.AccessLog;
import com.oop.appa.exception.ErrorResponse;
import com.oop.appa.service.AccessLogService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @Operation(summary = "Retrieve all AccessLogs")
    @GetMapping()
    public ResponseEntity<?> findAll() {
        try {
            List<AccessLog> accessLogs = accessLogService.findAll();
            return ResponseEntity.ok(accessLogs.stream().map(AccessLogDTO::new).collect(Collectors.toList()));
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all access logs");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

    }

    @Operation(summary = "Retrieve all AccessLogs with pagination")
    @GetMapping("/paged")
    public Page<AccessLog> findAllPaged(Pageable pageable) {
        return accessLogService.findAllPaged(pageable);
    }

    @Operation(summary = "Retrieve all AccessLogs by user id")
    @GetMapping("/user/{user_id}")
    public Page<AccessLog> findByUserId(@PathVariable Integer user_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return accessLogService.findByUserId(user_id, pageable);
    }

    // POST endpoint for creating a new AccessLog
    @Operation(summary = "Create a new AccessLog")
    @PostMapping
    public void createAccessLog(@RequestBody AccessLog AccessLog) {
        accessLogService.save(AccessLog);
    }

    // PUT endpoint for updating an existing AccessLog
    @Operation(summary = "Update an existing AccessLog")
    @PutMapping
    public void updateAccessLog(@RequestBody AccessLog AccessLog) {
        accessLogService.save(AccessLog);
    }

    // DELETE endpoints
    @Operation(summary = "Delete an AccessLog by id")
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Integer id) {
        accessLogService.deleteById(id);
    }

    @Operation(summary = "Delete an AccessLog by AccessLog object")
    @DeleteMapping
    public void delete(@RequestBody AccessLog AccessLog) {
        accessLogService.delete(AccessLog);
    }

}
