package com.storemetrics.modules.stores.controllers;

import com.storemetrics.modules.stores.dto.StoreDto;
import com.storemetrics.modules.stores.services.StoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/stores")
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping
    public ResponseEntity<List<StoreDto>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStoreById(@PathVariable UUID id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @PostMapping
    public ResponseEntity<StoreDto> createStore(@RequestBody StoreDto storeDto) {
        return ResponseEntity.ok(storeService.createStore(storeDto));
    }
}
