package com.storemetrics.modules.analytics.dto;

import java.math.BigDecimal;

public record CustomerCohort(
        Long totalCustomers,
        Long newCustomers,
        Long repeatCustomers,
        BigDecimal retentionRate
) {}
