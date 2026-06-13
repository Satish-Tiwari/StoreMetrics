package com.storemetrics.modules.woocommerce.services;

import com.storemetrics.modules.stores.entities.Store;

public interface WooCommerceClient {
    // Methods for fetching paginated data
    Object fetchProducts(Store store, int page, int perPage);
    Object fetchOrders(Store store, int page, int perPage);
    Object fetchCustomers(Store store, int page, int perPage);
}
