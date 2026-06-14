package com.storemetrics.modules.sync.entities;

import com.storemetrics.database.entities.BaseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_reviews")
@SQLDelete(sql = "UPDATE product_reviews SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class ProductReview extends BaseEntity {

    @Column(name = "external_review_id", unique = true, nullable = false)
    private Long externalReviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "reviewer_name")
    private String reviewerName;

    @Column(name = "reviewer_email")
    private String reviewerEmail;

    @Column(name = "review_text", columnDefinition = "TEXT")
    private String reviewText;

    private Integer rating;

    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    public Long getExternalReviewId() {
        return externalReviewId;
    }

    public void setExternalReviewId(Long externalReviewId) {
        this.externalReviewId = externalReviewId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public String getReviewerEmail() {
        return reviewerEmail;
    }

    public void setReviewerEmail(String reviewerEmail) {
        this.reviewerEmail = reviewerEmail;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }
}
