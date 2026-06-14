package com.storemetrics.modules.sync.entities;

import com.storemetrics.database.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Table(name = "sync_state")
@SQLDelete(sql = "UPDATE sync_state SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class SyncState extends BaseEntity {

    @Column(name = "entity_type", unique = true, nullable = false)
    private String entityType;

    @Column(name = "last_successful_sync")
    private LocalDateTime lastSuccessfulSync;

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public LocalDateTime getLastSuccessfulSync() {
        return lastSuccessfulSync;
    }

    public void setLastSuccessfulSync(LocalDateTime lastSuccessfulSync) {
        this.lastSuccessfulSync = lastSuccessfulSync;
    }
}
