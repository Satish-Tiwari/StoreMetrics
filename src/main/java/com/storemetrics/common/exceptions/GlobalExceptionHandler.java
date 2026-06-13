package com.storemetrics.common.exceptions;

import com.storemetrics.common.dto.ErrorVm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorVm> handleNotFoundException(NotFoundException ex, WebRequest request) {
        log.warn("Not Found: {}", ex.getMessage());
        ErrorVm errorVm = new ErrorVm(
                String.valueOf(HttpStatus.NOT_FOUND.value()),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                ex.getMessage()
        );
        return new ResponseEntity<>(errorVm, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorVm> handleBadRequestException(BadRequestException ex, WebRequest request) {
        log.warn("Bad Request: {}", ex.getMessage());
        ErrorVm errorVm = new ErrorVm(
                String.valueOf(HttpStatus.BAD_REQUEST.value()),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                ex.getMessage()
        );
        return new ResponseEntity<>(errorVm, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorVm> handleGlobalException(Exception ex, WebRequest request) {
        log.error("Internal Server Error", ex);
        ErrorVm errorVm = new ErrorVm(
                String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "An unexpected error occurred"
        );
        return new ResponseEntity<>(errorVm, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
