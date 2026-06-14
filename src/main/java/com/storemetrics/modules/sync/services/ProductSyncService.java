package com.storemetrics.modules.sync.services;

import com.storemetrics.config.WooCommerceEndpoints;
import com.storemetrics.modules.sync.entities.Product;
import com.storemetrics.modules.sync.entities.ProductCategory;
import com.storemetrics.modules.sync.repositories.ProductCategoryRepository;
import com.storemetrics.modules.sync.repositories.ProductRepository;
import com.storemetrics.modules.sync.repositories.SyncStateRepository;
import com.storemetrics.modules.woocommerce.services.WooCommerceClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class ProductSyncService extends BaseSyncService {

    private final ProductRepository repository;
    private final ProductCategoryRepository categoryRepository;

    public ProductSyncService(WooCommerceClient client, SyncStateRepository syncStateRepository, 
                              ProductRepository repository, ProductCategoryRepository categoryRepository) {
        super(client, syncStateRepository, "PRODUCTS", WooCommerceEndpoints.PRODUCTS);
        this.repository = repository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    protected void upsertEntity(Map<String, Object> data) {
        Long externalId = Long.valueOf(data.get("id").toString());
        Optional<Product> existing = repository.findByExternalProductId(externalId);
        
        Product product = existing.orElse(new Product());
        product.setExternalProductId(externalId);
        product.setName((String) data.get("name"));
        product.setSku((String) data.get("sku"));
        product.setStatus((String) data.get("status"));
        product.setStockQuantity(data.get("stock_quantity") != null ? Integer.valueOf(data.get("stock_quantity").toString()) : 0);

        String priceStr = (String) data.get("price");
        if (priceStr != null && !priceStr.isEmpty()) {
            product.setPrice(new BigDecimal(priceStr));
        }

        String regularPriceStr = (String) data.get("regular_price");
        if (regularPriceStr != null && !regularPriceStr.isEmpty()) {
            product.setRegularPrice(new BigDecimal(regularPriceStr));
        }

        String salePriceStr = (String) data.get("sale_price");
        if (salePriceStr != null && !salePriceStr.isEmpty()) {
            product.setSalePrice(new BigDecimal(salePriceStr));
        }

        // Map Categories
        List<Map<String, Object>> cats = (List<Map<String, Object>>) data.get("categories");
        Set<ProductCategory> linkedCategories = new HashSet<>();
        if (cats != null) {
            for (Map<String, Object> c : cats) {
                Long catId = Long.valueOf(c.get("id").toString());
                categoryRepository.findByExternalCategoryId(catId).ifPresent(linkedCategories::add);
            }
        }
        product.setCategories(linkedCategories);

        repository.save(product);
    }

    @Override
    @Transactional
    protected void reconcileDeletions(java.util.Set<Long> remoteIds) {
        java.util.List<Product> allLocal = repository.findAll();
        for (Product local : allLocal) {
            if (!remoteIds.contains(local.getExternalProductId())) {
                repository.delete(local);
            }
        }
    }
}
