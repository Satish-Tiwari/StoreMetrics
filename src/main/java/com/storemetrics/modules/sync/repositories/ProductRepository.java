package com.storemetrics.modules.sync.repositories;

import com.storemetrics.modules.sync.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<Product> findByExternalProductId(Long externalProductId);
}
