package com.storemetrics.modules.analytics.dto;

import java.time.LocalDateTime;
import java.util.List;

public record AnalyticsPayload(
        KpiOverview kpis,
        CustomerCohort retention,
        List<ProductPerformance> topProducts,
        List<SalesTrend> salesTrend,
        LocalDateTime computedAt
) {}
