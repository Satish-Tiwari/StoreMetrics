package com.storemetrics.modules.sync.repositories;

import com.storemetrics.modules.sync.entities.SyncState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SyncStateRepository extends JpaRepository<SyncState, java.util.UUID> {
    Optional<SyncState> findByEntityType(String entityType);
}
