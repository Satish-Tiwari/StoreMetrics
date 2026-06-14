package com.storemetrics.modules.woocommerce.controllers;

import com.storemetrics.config.WooCommerceEndpoints;
import com.storemetrics.modules.woocommerce.services.WooCommerceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/woocommerce")
public class WooCommerceHealthController {

    private final WooCommerceClient client;

    public WooCommerceHealthController(WooCommerceClient client) {
        this.client = client;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        String siteUrl = client.getSiteUrl();
        
        response.put("siteUrl", siteUrl);
        response.put("isHttps", siteUrl != null && siteUrl.toLowerCase().startsWith("https"));
        
        boolean mainSiteReachable = client.pingMainSite();
        response.put("mainSiteReachable", mainSiteReachable);

        List<Map<String, String>> endpointsHealth = new ArrayList<>();
        
        // Define endpoints to check
        String[][] endpointsToCheck = {
            {"Orders", WooCommerceEndpoints.ORDERS},
            {"Products", WooCommerceEndpoints.PRODUCTS},
            {"Customers", WooCommerceEndpoints.CUSTOMERS},
            {"Coupons", WooCommerceEndpoints.COUPONS},
            {"Product Categories", WooCommerceEndpoints.PRODUCT_CATEGORIES},
            {"Product Reviews", WooCommerceEndpoints.PRODUCT_REVIEWS}
        };

        for (String[] endpointData : endpointsToCheck) {
            String name = endpointData[0];
            String path = endpointData[1];
            boolean isReachable = client.pingEndpoint(path);
            
            Map<String, String> endpointStatus = new HashMap<>();
            endpointStatus.put("name", name);
            endpointStatus.put("path", path);
            endpointStatus.put("status", isReachable ? "OK" : "ERROR");
            endpointStatus.put("message", isReachable ? "Reachable" : "Unreachable or Unauthorized");
            endpointsHealth.add(endpointStatus);
        }

        response.put("endpoints", endpointsHealth);

        return ResponseEntity.ok(response);
    }
}
