package com.storemetrics.modules.sync.services;

import com.storemetrics.config.WooCommerceEndpoints;
import com.storemetrics.modules.sync.entities.ProductCategory;
import com.storemetrics.modules.sync.repositories.ProductCategoryRepository;
import com.storemetrics.modules.sync.repositories.SyncStateRepository;
import com.storemetrics.modules.woocommerce.services.WooCommerceClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class CategorySyncService extends BaseSyncService {

    private final ProductCategoryRepository repository;

    public CategorySyncService(WooCommerceClient client, SyncStateRepository syncStateRepository, ProductCategoryRepository repository) {
        super(client, syncStateRepository, "PRODUCT_CATEGORIES", WooCommerceEndpoints.PRODUCT_CATEGORIES);
        this.repository = repository;
    }

    @Override
    @Transactional
    protected void upsertEntity(Map<String, Object> data) {
        Long externalId = Long.valueOf(data.get("id").toString());
        Optional<ProductCategory> existing = repository.findByExternalCategoryId(externalId);
        
        ProductCategory category = existing.orElse(new ProductCategory());
        category.setExternalCategoryId(externalId);
        category.setName((String) data.get("name"));
        category.setSlug((String) data.get("slug"));
        category.setDescription((String) data.get("description"));
        category.setProductCount(data.get("count") != null ? Integer.valueOf(data.get("count").toString()) : 0);

        repository.save(category);
    }

    @Override
    @Transactional
    protected void reconcileDeletions(java.util.Set<Long> remoteIds) {
        java.util.List<ProductCategory> allLocal = repository.findAll();
        for (ProductCategory local : allLocal) {
            if (!remoteIds.contains(local.getExternalCategoryId())) {
                repository.delete(local);
            }
        }
    }
}
