package com.storemetrics.modules.sync.repositories;

import com.storemetrics.modules.sync.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Optional<Customer> findByStoreIdAndExternalCustomerId(UUID storeId, Long externalCustomerId);
}
