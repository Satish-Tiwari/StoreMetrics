package com.storemetrics.modules.sync.repositories;

import com.storemetrics.modules.sync.entities.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefundRepository extends JpaRepository<Refund, UUID> {
    Optional<Refund> findByExternalRefundId(Long externalRefundId);
}
