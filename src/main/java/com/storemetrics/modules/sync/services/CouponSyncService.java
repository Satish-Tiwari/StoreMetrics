package com.storemetrics.modules.sync.services;

import com.storemetrics.config.WooCommerceEndpoints;
import com.storemetrics.modules.sync.entities.Coupon;
import com.storemetrics.modules.sync.repositories.CouponRepository;
import com.storemetrics.modules.sync.repositories.SyncStateRepository;
import com.storemetrics.modules.woocommerce.services.WooCommerceClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@Service
public class CouponSyncService extends BaseSyncService {

    private final CouponRepository repository;

    public CouponSyncService(WooCommerceClient client, SyncStateRepository syncStateRepository, CouponRepository repository) {
        super(client, syncStateRepository, "COUPONS", WooCommerceEndpoints.COUPONS);
        this.repository = repository;
    }

    @Override
    @Transactional
    protected void upsertEntity(Map<String, Object> data) {
        Long externalId = Long.valueOf(data.get("id").toString());
        Optional<Coupon> existing = repository.findByExternalCouponId(externalId);
        
        Coupon coupon = existing.orElse(new Coupon());
        coupon.setExternalCouponId(externalId);
        coupon.setCode((String) data.get("code"));
        
        String amountStr = (String) data.get("amount");
        if (amountStr != null && !amountStr.isEmpty()) {
            coupon.setAmount(new BigDecimal(amountStr));
        }
        
        coupon.setDiscountType((String) data.get("discount_type"));
        coupon.setUsageCount(data.get("usage_count") != null ? Integer.valueOf(data.get("usage_count").toString()) : 0);

        String dateExpiresStr = (String) data.get("date_expires");
        if (dateExpiresStr != null && !dateExpiresStr.isEmpty()) {
            coupon.setDateExpires(LocalDateTime.parse(dateExpiresStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        repository.save(coupon);
    }

    @Override
    @Transactional
    protected void reconcileDeletions(java.util.Set<Long> remoteIds) {
        java.util.List<Coupon> allLocal = repository.findAll();
        for (Coupon local : allLocal) {
            if (!remoteIds.contains(local.getExternalCouponId())) {
                repository.delete(local);
            }
        }
    }
}
