package com.oop.appa.controller;

import com.oop.appa.service.AlphaVantageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class AlphaVantageController {

    private final AlphaVantageService alphaVantageService;

    @Autowired
public AlphaVantageController(AlphaVantageService alphaVantageService) {
    this.alphaVantageService = alphaVantageService;
}


@GetMapping("/symbol/{keyword}")
public ResponseEntity<String> searchSymbolByKeyword(@PathVariable String keyword) {
    try {
        String result = alphaVantageService.searchSymbolByKeyword(keyword);
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error searching symbol by keyword: " + e.getMessage());
    }
}

}

