package com.storemetrics.modules.sync.repositories;

import com.storemetrics.modules.sync.entities.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, java.util.UUID> {
    Optional<Coupon> findByExternalCouponId(Long externalCouponId);
}
