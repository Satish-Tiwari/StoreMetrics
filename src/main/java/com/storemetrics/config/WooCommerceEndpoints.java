package com.storemetrics.config;

public final class WooCommerceEndpoints {

    private WooCommerceEndpoints() {
        // Prevent instantiation
    }

    public static final String API_PREFIX = "/wp-json/wc/v3";
    
    public static final String ORDERS = API_PREFIX + "/orders";
    public static final String PRODUCTS = API_PREFIX + "/products";
    public static final String CUSTOMERS = API_PREFIX + "/customers";
    public static final String COUPONS = API_PREFIX + "/coupons";
    public static final String PRODUCT_CATEGORIES = API_PREFIX + "/products/categories";
    public static final String PRODUCT_REVIEWS = API_PREFIX + "/products/reviews";
    public static final String REFUNDS = API_PREFIX + "/refunds";

    /**
     * Helper to get order-specific refunds.
     */
    public static String getOrderRefundsEndpoint(Long orderId) {
        return ORDERS + "/" + orderId + "/refunds";
    }
}
