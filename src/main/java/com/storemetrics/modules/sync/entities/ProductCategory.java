package com.storemetrics.modules.sync.entities;

import com.storemetrics.database.entities.BaseEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.Set;

@Entity
@Table(name = "product_categories")
@SQLDelete(sql = "UPDATE product_categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class ProductCategory extends BaseEntity {

    @Column(name = "external_category_id", unique = true, nullable = false)
    private Long externalCategoryId;

    private String name;
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "product_count")
    private Integer productCount;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    private Set<Product> products;

    public Long getExternalCategoryId() {
        return externalCategoryId;
    }

    public void setExternalCategoryId(Long externalCategoryId) {
        this.externalCategoryId = externalCategoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getProductCount() {
        return productCount;
    }

    public void setProductCount(Integer productCount) {
        this.productCount = productCount;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }
}
