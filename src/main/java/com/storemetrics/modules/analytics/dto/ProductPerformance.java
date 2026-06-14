package com.storemetrics.modules.analytics.dto;

import java.math.BigDecimal;

public record ProductPerformance(
        String productName,
        Long quantitySold,
        BigDecimal totalRevenue
) {}
