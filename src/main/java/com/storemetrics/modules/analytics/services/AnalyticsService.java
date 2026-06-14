package com.storemetrics.modules.analytics.services;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AnalyticsService {

    private final org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate jdbcTemplate;

    public AnalyticsService(org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public com.storemetrics.modules.analytics.dto.AnalyticsPayload getStoreMetrics(UUID storeId, String startDate, String endDate) {
        org.springframework.jdbc.core.namedparam.MapSqlParameterSource params = new org.springframework.jdbc.core.namedparam.MapSqlParameterSource();
        params.addValue("storeId", storeId);
        // Cast dates to java.sql.Timestamp or java.time.LocalDateTime depending on the string format.
        // The frontend sends format "YYYY-MM-DD". We append time to make it a timestamp since date_created is timestamp.
        params.addValue("startDate", java.sql.Timestamp.valueOf(startDate + " 00:00:00"));
        params.addValue("endDate", java.sql.Timestamp.valueOf(endDate + " 23:59:59"));

        // 1. KPI Overview (Gross Revenue & Orders)
        String kpiSql = "SELECT " +
                "COALESCE(SUM(total), 0) AS gross_revenue, " +
                "COUNT(id) AS total_orders " +
                "FROM orders " +
                "WHERE store_id = :storeId " +
                "AND status NOT IN ('cancelled', 'failed', 'pending') " +
                "AND date_created BETWEEN :startDate AND :endDate";

        java.util.Map<String, Object> kpiResult = jdbcTemplate.queryForMap(kpiSql, params);
        java.math.BigDecimal grossRevenue = (java.math.BigDecimal) kpiResult.getOrDefault("gross_revenue", java.math.BigDecimal.ZERO);
        Long totalOrders = ((Number) kpiResult.getOrDefault("total_orders", 0L)).longValue();

        // Refunds Calculation (simplified approach: sum of refund totals within timeframe)
        String refundSql = "SELECT COALESCE(SUM(amount), 0) AS total_refunds " +
                "FROM refunds r JOIN orders o ON r.order_id = o.id " +
                "WHERE o.store_id = :storeId AND r.date_created BETWEEN :startDate AND :endDate";
        java.math.BigDecimal totalRefunds = java.math.BigDecimal.ZERO;
        try {
            totalRefunds = jdbcTemplate.queryForObject(refundSql, params, java.math.BigDecimal.class);
            if (totalRefunds == null) totalRefunds = java.math.BigDecimal.ZERO;
        } catch (Exception e) {
            // Table might be different or not exist, fallback to 0
        }
        
        java.math.BigDecimal netRevenue = grossRevenue.subtract(totalRefunds);
        java.math.BigDecimal averageOrderValue = totalOrders > 0 
                ? grossRevenue.divide(java.math.BigDecimal.valueOf(totalOrders), 2, java.math.RoundingMode.HALF_UP) 
                : java.math.BigDecimal.ZERO;

        com.storemetrics.modules.analytics.dto.KpiOverview kpis = new com.storemetrics.modules.analytics.dto.KpiOverview(
                grossRevenue, totalRefunds, netRevenue, totalOrders, averageOrderValue
        );

        // 2. Cohort Analysis
        String cohortSql = "WITH customer_purchases AS (" +
                "SELECT customer_id, COUNT(id) AS purchase_count " +
                "FROM orders " +
                "WHERE store_id = :storeId AND status NOT IN ('cancelled', 'failed', 'pending') " +
                "GROUP BY customer_id) " +
                "SELECT " +
                "COUNT(customer_id) as total_customers, " +
                "COUNT(CASE WHEN purchase_count = 1 THEN 1 END) as new_customers, " +
                "COUNT(CASE WHEN purchase_count > 1 THEN 1 END) as repeat_customers, " +
                "CASE WHEN COUNT(customer_id) = 0 THEN 0 ELSE " +
                "COUNT(CASE WHEN purchase_count > 1 THEN 1 END)::numeric / COUNT(customer_id) * 100 END AS repeat_customer_rate " +
                "FROM customer_purchases WHERE customer_id IS NOT NULL";

        java.util.Map<String, Object> cohortResult = jdbcTemplate.queryForMap(cohortSql, params);
        Long totalCustomers = ((Number) cohortResult.getOrDefault("total_customers", 0L)).longValue();
        Long newCustomers = ((Number) cohortResult.getOrDefault("new_customers", 0L)).longValue();
        Long repeatCustomers = ((Number) cohortResult.getOrDefault("repeat_customers", 0L)).longValue();
        java.math.BigDecimal retentionRate = (java.math.BigDecimal) cohortResult.getOrDefault("repeat_customer_rate", java.math.BigDecimal.ZERO);

        com.storemetrics.modules.analytics.dto.CustomerCohort cohort = new com.storemetrics.modules.analytics.dto.CustomerCohort(
                totalCustomers, newCustomers, repeatCustomers, retentionRate
        );

        // 3. Product Performance
        String productSql = "SELECT " +
                "oi.name AS product_name, " +
                "SUM(oi.quantity) AS units_sold, " +
                "SUM(oi.total) AS total_revenue " +
                "FROM order_items oi " +
                "JOIN orders o ON oi.order_id = o.id " +
                "WHERE o.store_id = :storeId " +
                "AND o.status NOT IN ('cancelled', 'failed', 'pending') " +
                "AND o.date_created BETWEEN :startDate AND :endDate " +
                "GROUP BY oi.name " +
                "ORDER BY total_revenue DESC LIMIT 10";

        java.util.List<com.storemetrics.modules.analytics.dto.ProductPerformance> topProducts = jdbcTemplate.query(
                productSql, params,
                (rs, rowNum) -> new com.storemetrics.modules.analytics.dto.ProductPerformance(
                        rs.getString("product_name"),
                        rs.getLong("units_sold"),
                        rs.getBigDecimal("total_revenue")
                )
        );

        // 4. Sales Trend
        String trendSql = "SELECT " +
                "TO_CHAR(date_trunc('day', date_created), 'YYYY-MM-DD') AS sales_date, " +
                "COALESCE(SUM(total), 0) AS revenue, " +
                "COUNT(id) AS order_count " +
                "FROM orders " +
                "WHERE store_id = :storeId " +
                "AND status NOT IN ('cancelled', 'failed', 'pending') " +
                "AND date_created BETWEEN :startDate AND :endDate " +
                "GROUP BY sales_date " +
                "ORDER BY sales_date ASC";

        java.util.List<com.storemetrics.modules.analytics.dto.SalesTrend> trend = jdbcTemplate.query(
                trendSql, params,
                (rs, rowNum) -> new com.storemetrics.modules.analytics.dto.SalesTrend(
                        rs.getString("sales_date"),
                        rs.getBigDecimal("revenue"),
                        rs.getLong("order_count")
                )
        );

        return new com.storemetrics.modules.analytics.dto.AnalyticsPayload(
                kpis, cohort, topProducts, trend, java.time.LocalDateTime.now()
        );
    }
}
