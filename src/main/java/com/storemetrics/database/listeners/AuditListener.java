package com.storemetrics.database.listeners;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AuditListener {
    private static final Logger log = LoggerFactory.getLogger(AuditListener.class);

    @PrePersist
    public void beforeInsert(Object entity) {
        log.info("[DATABASE-AUDIT]: Record inserting into {}", entity.getClass().getSimpleName());
    }

    @PreUpdate
    public void beforeUpdate(Object entity) {
        log.info("[DATABASE-AUDIT]: Record updating in {}", entity.getClass().getSimpleName());
    }
}
