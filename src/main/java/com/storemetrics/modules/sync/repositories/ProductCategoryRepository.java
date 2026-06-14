package com.storemetrics.modules.sync.repositories;

import com.storemetrics.modules.sync.entities.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, java.util.UUID> {
    Optional<ProductCategory> findByExternalCategoryId(Long externalCategoryId);
}
