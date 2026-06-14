package com.storemetrics.modules.sync.services;

import com.storemetrics.config.WooCommerceEndpoints;
import com.storemetrics.modules.sync.entities.Customer;
import com.storemetrics.modules.sync.entities.Order;
import com.storemetrics.modules.sync.repositories.CustomerRepository;
import com.storemetrics.modules.sync.repositories.OrderRepository;
import com.storemetrics.modules.sync.repositories.SyncStateRepository;
import com.storemetrics.modules.woocommerce.services.WooCommerceClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@Service
public class OrderSyncService extends BaseSyncService {

    private final OrderRepository repository;
    private final CustomerRepository customerRepository;

    public OrderSyncService(WooCommerceClient client, SyncStateRepository syncStateRepository, 
                            OrderRepository repository, CustomerRepository customerRepository) {
        super(client, syncStateRepository, "ORDERS", WooCommerceEndpoints.ORDERS);
        this.repository = repository;
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    protected void upsertEntity(Map<String, Object> data) {
        Long externalId = Long.valueOf(data.get("id").toString());
        Optional<Order> existing = repository.findByExternalOrderId(externalId);
        
        Order order = existing.orElse(new Order());
        order.setExternalOrderId(externalId);
        order.setStatus((String) data.get("status"));
        order.setCurrency((String) data.get("currency"));
        order.setCreatedVia((String) data.get("created_via"));

        String totalStr = (String) data.get("total");
        if (totalStr != null && !totalStr.isEmpty()) {
            order.setTotal(new BigDecimal(totalStr));
        }

        String discountTotalStr = (String) data.get("discount_total");
        if (discountTotalStr != null && !discountTotalStr.isEmpty()) {
            order.setDiscountTotal(new BigDecimal(discountTotalStr));
        }

        String shippingTotalStr = (String) data.get("shipping_total");
        if (shippingTotalStr != null && !shippingTotalStr.isEmpty()) {
            order.setShippingTotal(new BigDecimal(shippingTotalStr));
        }

        String totalTaxStr = (String) data.get("total_tax");
        if (totalTaxStr != null && !totalTaxStr.isEmpty()) {
            order.setTotalTax(new BigDecimal(totalTaxStr));
        }

        String dateCreatedStr = (String) data.get("date_created");
        if (dateCreatedStr != null && !dateCreatedStr.isEmpty()) {
            order.setDateCreated(LocalDateTime.parse(dateCreatedStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        String dateModifiedStr = (String) data.get("date_modified");
        if (dateModifiedStr != null && !dateModifiedStr.isEmpty()) {
            order.setDateModified(LocalDateTime.parse(dateModifiedStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        // Link Customer
        Long customerId = Long.valueOf(data.get("customer_id").toString());
        if (customerId > 0) {
            customerRepository.findByExternalCustomerId(customerId).ifPresent(order::setCustomer);
        }

        repository.save(order);
    }

    @Override
    @Transactional
    protected void reconcileDeletions(java.util.Set<Long> remoteIds) {
        java.util.List<Order> allLocal = repository.findAll();
        for (Order local : allLocal) {
            if (!remoteIds.contains(local.getExternalOrderId())) {
                repository.delete(local);
            }
        }
    }
}
