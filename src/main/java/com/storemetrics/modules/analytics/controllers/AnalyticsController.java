package com.storemetrics.modules.analytics.controllers;

import com.storemetrics.modules.analytics.services.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<Object> getStoreMetrics(@PathVariable UUID storeId) {
        return ResponseEntity.ok(analyticsService.getStoreMetrics(storeId));
    }
}
