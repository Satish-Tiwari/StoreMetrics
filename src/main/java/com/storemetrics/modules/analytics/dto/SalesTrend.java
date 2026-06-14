package com.storemetrics.modules.analytics.dto;

import java.math.BigDecimal;

public record SalesTrend(
        String date,
        BigDecimal revenue,
        Long orders
) {}
