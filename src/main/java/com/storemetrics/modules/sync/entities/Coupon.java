package com.storemetrics.modules.sync.entities;

import com.storemetrics.database.entities.BaseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@SQLDelete(sql = "UPDATE coupons SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class Coupon extends BaseEntity {

    @Column(name = "external_coupon_id", unique = true, nullable = false)
    private Long externalCouponId;

    @Column(unique = true, nullable = false)
    private String code;

    private BigDecimal amount;

    @Column(name = "discount_type")
    private String discountType;

    @Column(name = "usage_count")
    private Integer usageCount;

    @Column(name = "date_expires")
    private LocalDateTime dateExpires;

    public Long getExternalCouponId() {
        return externalCouponId;
    }

    public void setExternalCouponId(Long externalCouponId) {
        this.externalCouponId = externalCouponId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public Integer getUsageCount() {
        return usageCount;
    }

    public void setUsageCount(Integer usageCount) {
        this.usageCount = usageCount;
    }

    public LocalDateTime getDateExpires() {
        return dateExpires;
    }

    public void setDateExpires(LocalDateTime dateExpires) {
        this.dateExpires = dateExpires;
    }
}
