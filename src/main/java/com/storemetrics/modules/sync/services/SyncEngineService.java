package com.storemetrics.modules.sync.services;

import com.storemetrics.modules.stores.dto.StoreDto;
import com.storemetrics.modules.stores.services.StoreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SyncEngineService {

    private static final Logger log = LoggerFactory.getLogger(SyncEngineService.class);
    private final StoreService storeService;

    public SyncEngineService(StoreService storeService) {
        this.storeService = storeService;
    }

    @Async
    public void startHistoricalSync(UUID storeId) {
        StoreDto store = storeService.getStoreById(storeId);
        log.info("Starting historical sync for store: {}", store.getName());
        // TODO: Implement paginated sync from WooCommerce API
    }
}
