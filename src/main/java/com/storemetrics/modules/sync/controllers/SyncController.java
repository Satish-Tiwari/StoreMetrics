package com.storemetrics.modules.sync.controllers;

import com.storemetrics.modules.sync.services.SyncEngineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.storemetrics.modules.sync.entities.SyncState;
import com.storemetrics.modules.sync.repositories.SyncStateRepository;

import java.util.List;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    private static final Logger log = LoggerFactory.getLogger(SyncController.class);
    private final SyncEngineService syncEngineService;
    private final SyncStateRepository syncStateRepository;

    public SyncController(SyncEngineService syncEngineService, SyncStateRepository syncStateRepository) {
        this.syncEngineService = syncEngineService;
        this.syncStateRepository = syncStateRepository;
    }

    @PostMapping("/manual")
    public ResponseEntity<String> triggerManualSync() {
        log.info("Received request to trigger manual global sync from UI.");
        syncEngineService.triggerManualSync();
        return ResponseEntity.ok("Global sync triggered successfully.");
    }

    @PostMapping("/manual/{entityType}")
    public ResponseEntity<String> triggerEntitySync(@org.springframework.web.bind.annotation.PathVariable String entityType) {
        log.info("Received request to trigger manual sync for entity: {}", entityType);
        syncEngineService.triggerEntitySync(entityType);
        return ResponseEntity.ok("Sync triggered successfully for " + entityType);
    }

    @GetMapping("/status")
    public ResponseEntity<List<SyncState>> getSyncStatus() {
        return ResponseEntity.ok(syncStateRepository.findAll());
    }
}
