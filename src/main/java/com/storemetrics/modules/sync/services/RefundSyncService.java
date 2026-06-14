package com.storemetrics.modules.sync.services;

import com.storemetrics.config.WooCommerceEndpoints;
import com.storemetrics.modules.sync.entities.Order;
import com.storemetrics.modules.sync.entities.Refund;
import com.storemetrics.modules.sync.repositories.OrderRepository;
import com.storemetrics.modules.sync.repositories.RefundRepository;
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
public class RefundSyncService extends BaseSyncService {

    private final RefundRepository repository;
    private final OrderRepository orderRepository;

    public RefundSyncService(WooCommerceClient client, SyncStateRepository syncStateRepository, 
                             RefundRepository repository, OrderRepository orderRepository) {
        super(client, syncStateRepository, "REFUNDS", WooCommerceEndpoints.REFUNDS);
        this.repository = repository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    protected void upsertEntity(Map<String, Object> data) {
        Long externalId = Long.valueOf(data.get("id").toString());
        Long orderId = Long.valueOf(data.get("order_id").toString());

        Optional<Order> orderOpt = orderRepository.findByExternalOrderId(orderId);
        if (orderOpt.isEmpty()) {
            log.warn("Skipping refund {} because order {} is not synced yet.", externalId, orderId);
            return;
        }

        Optional<Refund> existing = repository.findByExternalRefundId(externalId);
        Refund refund = existing.orElse(new Refund());

        refund.setExternalRefundId(externalId);
        refund.setOrder(orderOpt.get());
        
        String amountStr = (String) data.get("amount");
        if (amountStr != null && !amountStr.isEmpty()) {
            refund.setAmount(new BigDecimal(amountStr));
        }
        
        refund.setReason((String) data.get("reason"));

        String dateCreatedStr = (String) data.get("date_created");
        if (dateCreatedStr != null && !dateCreatedStr.isEmpty()) {
            refund.setDateCreated(LocalDateTime.parse(dateCreatedStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        repository.save(refund);
    }

    @Override
    @Transactional
    protected void reconcileDeletions(java.util.Set<Long> remoteIds) {
        java.util.List<Refund> allLocal = repository.findAll();
        for (Refund local : allLocal) {
            if (!remoteIds.contains(local.getExternalRefundId())) {
                repository.delete(local);
            }
        }
    }
}
