package com.storemetrics.modules.analytics.controllers;

import com.storemetrics.modules.analytics.services.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<Object> getStoreMetrics(
            @RequestParam UUID storeId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(analyticsService.getStoreMetrics(storeId, startDate, endDate));
    }
}
