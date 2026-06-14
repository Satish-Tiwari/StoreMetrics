package com.storemetrics.modules.sync.services;

import com.storemetrics.config.WooCommerceConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SyncEngineService {

    private static final Logger log = LoggerFactory.getLogger(SyncEngineService.class);
    private final DataSyncOrchestrator orchestrator;

    public SyncEngineService(DataSyncOrchestrator orchestrator) {
        this.orchestrator = orchestrator;
    }

    // Automatically trigger the global sync cycle every 8 hours.
    // Cron expression: 0 0 */8 * * * (At minute 0 past every 8th hour)
    @Scheduled(cron = "0 0 */8 * * *")
    public void scheduledSync() {
        log.info("Triggering scheduled WooCommerce sync (runs every 8 hours).");
        orchestrator.executeFullSyncCycle();
    }

    /**
     * Trigger a manual sync cycle from the UI or API for all entities.
     * Uses @Async to avoid blocking the HTTP request.
     */
    @Async
    public void triggerManualSync() {
        log.info("Manual global WooCommerce sync triggered.");
        orchestrator.executeFullSyncCycle();
    }

    /**
     * Trigger a manual sync cycle for a specific entity.
     * Uses @Async to avoid blocking the HTTP request.
     */
    @Async
    public void triggerEntitySync(String entityType) {
        log.info("Manual WooCommerce sync triggered for entity: {}", entityType);
        orchestrator.executeEntitySync(entityType);
    }
}
