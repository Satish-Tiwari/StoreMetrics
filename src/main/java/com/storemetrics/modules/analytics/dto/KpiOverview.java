package com.storemetrics.modules.analytics.dto;

import java.math.BigDecimal;

public record KpiOverview(
        BigDecimal grossRevenue,
        BigDecimal totalRefunds,
        BigDecimal netRevenue,
        Long orderVolume,
        BigDecimal averageOrderValue
) {}
