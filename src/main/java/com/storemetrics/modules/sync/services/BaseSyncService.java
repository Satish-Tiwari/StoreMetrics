package com.storemetrics.modules.sync.services;

import com.storemetrics.modules.sync.entities.SyncState;
import com.storemetrics.modules.sync.repositories.SyncStateRepository;
import com.storemetrics.modules.woocommerce.services.WooCommerceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public abstract class BaseSyncService {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected final WooCommerceClient client;
    protected final SyncStateRepository syncStateRepository;
    private final String entityType;
    private final String endpoint;

    public BaseSyncService(WooCommerceClient client, SyncStateRepository syncStateRepository, String entityType, String endpoint) {
        this.client = client;
        this.syncStateRepository = syncStateRepository;
        this.entityType = entityType;
        this.endpoint = endpoint;
    }

    @Transactional
    public void runDeltaSync() {
        log.info("Starting delta sync for {}", entityType);

        Optional<SyncState> stateOpt = syncStateRepository.findByEntityType(entityType);
        String modifiedAfter = null;

        if (stateOpt.isPresent() && stateOpt.get().getLastSuccessfulSync() != null) {
            // ISO-8601 format required by WooCommerce
            modifiedAfter = stateOpt.get().getLastSuccessfulSync().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }

        int page = 1;
        int perPage = 100;
        int totalProcessed = 0;

        while (true) {
            log.info("Fetching {} page {}", entityType, page);
            List<Map<String, Object>> records = client.fetchResources(endpoint, modifiedAfter, page, perPage, null);

            if (records == null || records.isEmpty()) {
                break;
            }

            for (Map<String, Object> record : records) {
                upsertEntity(record);
                totalProcessed++;
            }

            if (records.size() < perPage) {
                break;
            }
            page++;
        }

        updateSyncState();
        log.info("Finished delta sync for {}. Total processed: {}", entityType, totalProcessed);
    }

    protected abstract void upsertEntity(Map<String, Object> data);

    @Transactional
    public void runReconciliationSync() {
        log.info("Starting reconciliation (garbage collection) sync for {}", entityType);

        int page = 1;
        int perPage = 100;
        java.util.Set<Long> remoteIds = new java.util.HashSet<>();

        while (true) {
            List<Map<String, Object>> records = client.fetchResources(endpoint, null, page, perPage, "id");
            if (records == null || records.isEmpty()) {
                break;
            }

            for (Map<String, Object> record : records) {
                remoteIds.add(Long.valueOf(record.get("id").toString()));
            }

            if (records.size() < perPage) {
                break;
            }
            page++;
        }

        log.info("Fetched {} active IDs from WooCommerce for {}. Reconciling...", remoteIds.size(), entityType);
        reconcileDeletions(remoteIds);
    }

    protected abstract void reconcileDeletions(java.util.Set<Long> remoteIds);

    private void updateSyncState() {
        SyncState state = syncStateRepository.findByEntityType(entityType)
                .orElse(new SyncState());
        state.setEntityType(entityType);
        state.setLastSuccessfulSync(LocalDateTime.now());
        syncStateRepository.save(state);
    }
}
