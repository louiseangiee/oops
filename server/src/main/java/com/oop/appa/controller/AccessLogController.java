package com.oop.appa.controller;

import com.oop.appa.dto.AccessLogDTO;
import com.oop.appa.entity.AccessLog;
import com.oop.appa.exception.ErrorResponse;
import com.oop.appa.service.AccessLogService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

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
    @Parameter(name = "pageable", description = "pagination object")
    @GetMapping("/paged")
    public ResponseEntity<?> findAllPaged(Pageable pageable) {
        try {
            Page<AccessLog> accessLogs = accessLogService.findAllPaged(pageable);
            return ResponseEntity.ok(accessLogs);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all access logs with pagination");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

    }

    @Operation(summary = "Retrieve all AccessLogs by user id with pagination")
    @Parameter(name = "user_id", description = "user id")
    @Parameter(name = "page", description = "Page number for pagination")
    @Parameter(name = "size", description = "Number of records per page for pagination")
    @GetMapping("/user/{user_id}")
    public ResponseEntity<?> findByUserId(@PathVariable Integer user_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<AccessLog> accessLogs = accessLogService.findByUserIdPaged(user_id, pageable);
            return ResponseEntity.ok(accessLogs);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all access logs by user id with pagination");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Retrieve all AccessLogs by user id and portfolio id")
    @Parameter(name = "user_id", description = "user id")
    @Parameter(name = "portfolio_id", description = "portfolio id")
    @Parameter(name="page", description = "page number for pagination")
    @Parameter(name="size", description = "number of records per page for pagination")
    @GetMapping("/user/{user_id}/portfolio/{portfolio_id}")
    public ResponseEntity<?> findByUserIdAndPortfolioId(@PathVariable Integer user_id,
            @PathVariable Integer portfolio_id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<AccessLog> accessLogs = accessLogService.findByUserIdAndPortfolioIdPaged(user_id, portfolio_id, pageable);
            return ResponseEntity.ok(accessLogs);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all access logs by user id and portfolio id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // POST endpoint for creating a new AccessLog
    @Operation(summary = "Create a new AccessLog")
    @PostMapping
    public ResponseEntity<?> createAccessLog(@RequestBody AccessLog AccessLog) {
        try {
            AccessLog accessLog = accessLogService.save(AccessLog);
            return ResponseEntity.status(HttpStatus.CREATED).body(accessLog);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error creating a new access log");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

    }

    // PUT endpoint for updating an existing AccessLog
    @Operation(summary = "Update an existing AccessLog")
    @PutMapping
    public ResponseEntity<?> updateAccessLog(@RequestBody AccessLog AccessLog) {
        try {
            AccessLog accessLog = accessLogService.save(AccessLog);
            return ResponseEntity.ok(accessLog);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error updating an existing access log");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // DELETE endpoints
    @Operation(summary = "Delete an AccessLog by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Integer id) {
        try {
            accessLogService.deleteById(id);
            return ResponseEntity.ok("AccessLog with ID " + id + " was successfully deleted.");
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting AccessLog with ID " + id);
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @Operation(summary = "Delete an AccessLog by AccessLog object")
    @DeleteMapping
    public ResponseEntity<?> delete(@RequestBody AccessLog AccessLog) {
        try {
            accessLogService.delete(AccessLog);
            return ResponseEntity.ok("AccessLog was successfully deleted.");
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error deleting AccessLog");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
