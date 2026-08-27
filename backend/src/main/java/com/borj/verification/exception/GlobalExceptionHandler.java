package com.borj.verification.exception;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResource(
            NoResourceFoundException ex) {
        log.warn("Ressource inexistante : {}", ex.getResourcePath());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("NOT_FOUND", "Endpoint inexistant"));
    }

    @ExceptionHandler(ResultatDejaEnregistreException.class)
    public ResponseEntity<ErrorResponse> handleDejaEnregistre(
            ResultatDejaEnregistreException ex) {
        log.warn(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("DEJA_ENREGISTRE", ex.getMessage()));
    }

    @ExceptionHandler({IllegalArgumentException.class,
            IllegalStateException.class})
    public ResponseEntity<ErrorResponse> handleBadRequest(RuntimeException ex) {
        log.warn("Demande invalide : {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("BAD_REQUEST", ex.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        log.warn("Entite introuvable : {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(VersionConflictException.class)
    public ResponseEntity<ErrorResponse> handleVersionConflict(VersionConflictException ex) {
        log.warn("Conflit de version : {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("VERSION_CONFLICT", ex.getMessage()));
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ErrorResponse> handleOptimisticLock(
            ObjectOptimisticLockingFailureException ex) {
        log.warn("Verrou optimiste declenche par Hibernate", ex);
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("VERSION_CONFLICT",
                        "La ligne a ete modifiee entre-temps, merci de rafraichir"));
    }

    // Laisse passer les erreurs HTTP standard (404, 405, 415...)
    // sinon elles deviennent toutes des 500 generiques.
    @ExceptionHandler(ErrorResponseException.class)
    public ResponseEntity<ErrorResponse> handleHttp(ErrorResponseException ex) {
        log.warn("Erreur HTTP {} : {}", ex.getStatusCode(), ex.getMessage());
        return ResponseEntity.status(ex.getStatusCode())
                .body(new ErrorResponse("HTTP_ERROR", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Erreur non geree", ex);     // ← la ligne qui manquait
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("INTERNAL_ERROR",
                        "Une erreur inattendue est survenue"));
    }

    public record ErrorResponse(String code, String message, LocalDateTime timestamp) {
        public ErrorResponse(String code, String message) {
            this(code, message, LocalDateTime.now());
        }
    }
}