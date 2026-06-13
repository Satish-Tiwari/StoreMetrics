package com.storemetrics.modules.stores.repositories;

import com.storemetrics.modules.stores.entities.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID> {

    List<Store> findByStatusOrderByNameAsc(String status);

    @Modifying
    @Query("UPDATE Store s SET s.lastSyncedAt = CURRENT_TIMESTAMP WHERE s.id = :id")
    void updateLastSynced(UUID id);
}
