package com.storemetrics.modules.sync.services;

import com.storemetrics.config.WooCommerceEndpoints;
import com.storemetrics.modules.sync.entities.Product;
import com.storemetrics.modules.sync.entities.ProductReview;
import com.storemetrics.modules.sync.repositories.ProductRepository;
import com.storemetrics.modules.sync.repositories.ProductReviewRepository;
import com.storemetrics.modules.sync.repositories.SyncStateRepository;
import com.storemetrics.modules.woocommerce.services.WooCommerceClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewSyncService extends BaseSyncService {

    private final ProductReviewRepository repository;
    private final ProductRepository productRepository;

    public ReviewSyncService(WooCommerceClient client, SyncStateRepository syncStateRepository, 
                             ProductReviewRepository repository, ProductRepository productRepository) {
        super(client, syncStateRepository, "REVIEWS", WooCommerceEndpoints.PRODUCT_REVIEWS);
        this.repository = repository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    protected void upsertEntity(Map<String, Object> data) {
        Long externalId = Long.valueOf(data.get("id").toString());
        Long productId = Long.valueOf(data.get("product_id").toString());

        Optional<Product> productOpt = productRepository.findByExternalProductId(productId);
        if (productOpt.isEmpty()) {
            log.warn("Skipping review {} because product {} is not synced yet.", externalId, productId);
            return;
        }

        Optional<ProductReview> existing = repository.findByExternalReviewId(externalId);
        ProductReview review = existing.orElse(new ProductReview());

        review.setExternalReviewId(externalId);
        review.setProduct(productOpt.get());
        review.setReviewerName((String) data.get("reviewer"));
        review.setReviewerEmail((String) data.get("reviewer_email"));
        
        // Remove HTML tags from review if present
        String reviewText = (String) data.get("review");
        if (reviewText != null) {
            review.setReviewText(reviewText.replaceAll("<[^>]*>", ""));
        }
        
        review.setRating(data.get("rating") != null ? Integer.valueOf(data.get("rating").toString()) : 0);

        String dateCreatedStr = (String) data.get("date_created");
        if (dateCreatedStr != null && !dateCreatedStr.isEmpty()) {
            review.setDateCreated(LocalDateTime.parse(dateCreatedStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        repository.save(review);
    }

    @Override
    @Transactional
    protected void reconcileDeletions(java.util.Set<Long> remoteIds) {
        java.util.List<ProductReview> allLocal = repository.findAll();
        for (ProductReview local : allLocal) {
            if (!remoteIds.contains(local.getExternalReviewId())) {
                repository.delete(local);
            }
        }
    }
}
