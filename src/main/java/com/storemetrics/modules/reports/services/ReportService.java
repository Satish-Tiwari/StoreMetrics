package com.storemetrics.modules.reports.services;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ReportService {

    @Async
    public void generateReport(String format) {
        // TODO: Implement PDF/Excel template generation
    }
}
