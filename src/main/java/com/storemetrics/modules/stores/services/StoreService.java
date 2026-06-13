package com.storemetrics.modules.stores.services;

import com.storemetrics.common.exceptions.NotFoundException;
import com.storemetrics.modules.stores.dto.StoreDto;
import com.storemetrics.modules.stores.entities.Store;
import com.storemetrics.modules.stores.mapper.StoreMapper;
import com.storemetrics.modules.stores.repositories.StoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;

    public StoreService(StoreRepository storeRepository, StoreMapper storeMapper) {
        this.storeRepository = storeRepository;
        this.storeMapper = storeMapper;
    }

    public List<StoreDto> getAllStores() {
        return storeRepository.findAll()
                .stream()
                .map(storeMapper::toDto)
                .collect(Collectors.toList());
    }

    public StoreDto getStoreById(UUID id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Store not found with ID: " + id));
        return storeMapper.toDto(store);
    }

    public StoreDto createStore(StoreDto storeDto) {
        Store store = storeMapper.toEntity(storeDto);
        store.setStatus("Active");
        Store savedStore = storeRepository.save(store);
        return storeMapper.toDto(savedStore);
    }
}
