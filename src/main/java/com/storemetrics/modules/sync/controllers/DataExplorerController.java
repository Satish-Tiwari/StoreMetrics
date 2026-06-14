package com.storemetrics.modules.sync.controllers;

import com.storemetrics.modules.sync.entities.*;
import com.storemetrics.modules.sync.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/data")
public class DataExplorerController {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final CouponRepository couponRepository;
    private final RefundRepository refundRepository;
    private final ProductReviewRepository reviewRepository;

    public DataExplorerController(
            ProductRepository productRepository,
            ProductCategoryRepository categoryRepository,
            OrderRepository orderRepository,
            CustomerRepository customerRepository,
            CouponRepository couponRepository,
            RefundRepository refundRepository,
            ProductReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.couponRepository = couponRepository;
        this.refundRepository = refundRepository;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/products")
    public ResponseEntity<Page<Product>> getProducts(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(productRepository.findAll(pageable));
    }

    @GetMapping("/categories")
    public ResponseEntity<Page<ProductCategory>> getCategories(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(categoryRepository.findAll(pageable));
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<Order>> getOrders(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(orderRepository.findAll(pageable));
    }

    @GetMapping("/customers")
    public ResponseEntity<Page<Customer>> getCustomers(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(customerRepository.findAll(pageable));
    }

    @GetMapping("/coupons")
    public ResponseEntity<Page<Coupon>> getCoupons(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(couponRepository.findAll(pageable));
    }

    @GetMapping("/refunds")
    public ResponseEntity<Page<Refund>> getRefunds(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(refundRepository.findAll(pageable));
    }

    @GetMapping("/reviews")
    public ResponseEntity<Page<ProductReview>> getReviews(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(reviewRepository.findAll(pageable));
    }
}
