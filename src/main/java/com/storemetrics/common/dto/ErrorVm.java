package com.storemetrics.common.dto;

import java.time.LocalDateTime;

public class ErrorVm {
    private String statusCode;
    private String title;
    private String detail;
    private LocalDateTime timestamp;

    public ErrorVm() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorVm(String statusCode, String title, String detail) {
        this.statusCode = statusCode;
        this.title = title;
        this.detail = detail;
        this.timestamp = LocalDateTime.now();
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
