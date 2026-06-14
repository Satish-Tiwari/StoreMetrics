package com.storemetrics.modules.sync.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class DataSyncOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(DataSyncOrchestrator.class);

    private final CategorySyncService categorySyncService;
    private final ProductSyncService productSyncService;
    private final CustomerSyncService customerSyncService;
    private final OrderSyncService orderSyncService;
    private final RefundSyncService refundSyncService;
    private final CouponSyncService couponSyncService;
    private final ReviewSyncService reviewSyncService;

    public DataSyncOrchestrator(
            CategorySyncService categorySyncService,
            ProductSyncService productSyncService,
            CustomerSyncService customerSyncService,
            OrderSyncService orderSyncService,
            RefundSyncService refundSyncService,
            CouponSyncService couponSyncService,
            ReviewSyncService reviewSyncService) {
        this.categorySyncService = categorySyncService;
        this.productSyncService = productSyncService;
        this.customerSyncService = customerSyncService;
        this.orderSyncService = orderSyncService;
        this.refundSyncService = refundSyncService;
        this.couponSyncService = couponSyncService;
        this.reviewSyncService = reviewSyncService;
    }

    /**
     * Executes the incremental delta sync in topological order to satisfy foreign key constraints.
     */
    public void executeDeltaSync() {
        log.info("Starting global delta sync execution.");
        try {
            categorySyncService.runDeltaSync();
            productSyncService.runDeltaSync();
            customerSyncService.runDeltaSync();
            orderSyncService.runDeltaSync();
            refundSyncService.runDeltaSync();
            couponSyncService.runDeltaSync();
            reviewSyncService.runDeltaSync();
            log.info("Global delta sync execution completed successfully.");
        } catch (Exception e) {
            log.error("Global delta sync failed", e);
        }
    }

    /**
     * Executes the reconciliation sync in topological order to clean up deleted entities.
     */
    public void executeReconciliationSync() {
        log.info("Starting global reconciliation sync execution.");
        try {
            // It's often safer to delete child entities first to avoid foreign key violations, 
            // so we reverse the topological order for deletions.
            reviewSyncService.runReconciliationSync();
            couponSyncService.runReconciliationSync();
            refundSyncService.runReconciliationSync();
            orderSyncService.runReconciliationSync();
            customerSyncService.runReconciliationSync();
            productSyncService.runReconciliationSync();
            categorySyncService.runReconciliationSync();
            log.info("Global reconciliation sync execution completed successfully.");
        } catch (Exception e) {
            log.error("Global reconciliation sync failed", e);
        }
    }

    /**
     * Executes both delta sync and reconciliation sync.
     */
    public void executeFullSyncCycle() {
        log.info("--- Starting Full Sync Cycle ---");
        executeDeltaSync();
        executeReconciliationSync();
        log.info("--- Full Sync Cycle Complete ---");
    }

    /**
     * Executes both delta and reconciliation sync for a single entity type.
     */
    public void executeEntitySync(String entityType) {
        log.info("--- Starting Sync Cycle for Entity: {} ---", entityType);
        try {
            switch (entityType.toLowerCase()) {
                case "categories":
                    categorySyncService.runDeltaSync();
                    categorySyncService.runReconciliationSync();
                    break;
                case "products":
                    productSyncService.runDeltaSync();
                    productSyncService.runReconciliationSync();
                    break;
                case "customers":
                    customerSyncService.runDeltaSync();
                    customerSyncService.runReconciliationSync();
                    break;
                case "orders":
                    orderSyncService.runDeltaSync();
                    orderSyncService.runReconciliationSync();
                    break;
                case "refunds":
                    refundSyncService.runDeltaSync();
                    refundSyncService.runReconciliationSync();
                    break;
                case "coupons":
                    couponSyncService.runDeltaSync();
                    couponSyncService.runReconciliationSync();
                    break;
                case "reviews":
                    reviewSyncService.runDeltaSync();
                    reviewSyncService.runReconciliationSync();
                    break;
                default:
                    log.warn("Unknown entity type for sync: {}", entityType);
            }
        } catch (Exception e) {
            log.error("Entity sync failed for " + entityType, e);
        }
        log.info("--- Entity Sync Cycle Complete for {} ---", entityType);
    }
}
