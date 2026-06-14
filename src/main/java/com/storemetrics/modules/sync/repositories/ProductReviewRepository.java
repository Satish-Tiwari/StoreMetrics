package com.storemetrics.modules.sync.repositories;

import com.storemetrics.modules.sync.entities.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, java.util.UUID> {
    Optional<ProductReview> findByExternalReviewId(Long externalReviewId);
}
