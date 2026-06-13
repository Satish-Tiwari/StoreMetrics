package com.storemetrics.modules.sync.repositories;

import com.storemetrics.modules.sync.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<Order> findByStoreIdAndExternalOrderId(UUID storeId, Long externalOrderId);
}
