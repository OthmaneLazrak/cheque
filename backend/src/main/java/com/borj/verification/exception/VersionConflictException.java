package com.borj.verification.exception;

public class VersionConflictException extends RuntimeException {
    public VersionConflictException(String message) {
        super(message);
    }
}