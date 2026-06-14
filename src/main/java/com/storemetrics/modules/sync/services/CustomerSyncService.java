package com.storemetrics.modules.sync.services;

import com.storemetrics.config.WooCommerceEndpoints;
import com.storemetrics.modules.sync.entities.Customer;
import com.storemetrics.modules.sync.repositories.CustomerRepository;
import com.storemetrics.modules.sync.repositories.SyncStateRepository;
import com.storemetrics.modules.woocommerce.services.WooCommerceClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomerSyncService extends BaseSyncService {

    private final CustomerRepository repository;

    public CustomerSyncService(WooCommerceClient client, SyncStateRepository syncStateRepository, CustomerRepository repository) {
        super(client, syncStateRepository, "CUSTOMERS", WooCommerceEndpoints.CUSTOMERS);
        this.repository = repository;
    }

    @Override
    @Transactional
    protected void upsertEntity(Map<String, Object> data) {
        Long externalId = Long.valueOf(data.get("id").toString());
        Optional<Customer> existing = repository.findByExternalCustomerId(externalId);
        
        Customer customer = existing.orElse(new Customer());
        customer.setExternalCustomerId(externalId);
        customer.setEmail((String) data.get("email"));
        customer.setFirstName((String) data.get("first_name"));
        customer.setLastName((String) data.get("last_name"));
        customer.setUsername((String) data.get("username"));
        
        String totalSpentStr = (String) data.get("total_spent");
        if (totalSpentStr != null && !totalSpentStr.isEmpty()) {
            customer.setTotalSpent(new BigDecimal(totalSpentStr));
        }

        customer.setOrdersCount(data.get("orders_count") != null ? Integer.valueOf(data.get("orders_count").toString()) : 0);

        repository.save(customer);
    }

    @Override
    @Transactional
    protected void reconcileDeletions(java.util.Set<Long> remoteIds) {
        java.util.List<Customer> allLocal = repository.findAll();
        for (Customer local : allLocal) {
            if (!remoteIds.contains(local.getExternalCustomerId())) {
                repository.delete(local);
            }
        }
    }
}
