package com.borj.verification.controller;

import com.borj.verification.dto.DecisionRequestDTO;
import com.borj.verification.dto.DetailValeurDTO;
import com.borj.verification.dto.ValeurEnAttenteDTO;
import com.borj.verification.service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/verification-signature")
public class VerificationSignatureController {

    private final VerificationService service;

    public VerificationSignatureController(VerificationService service) {
        this.service = service;
    }

    @GetMapping("/file-attente")
    public List<ValeurEnAttenteDTO> getFileAttente(
            @RequestParam String agence,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateJournee
    ) {
        return service.getFileAttente(agence,
                dateJournee != null ? dateJournee : LocalDate.now());
    }

    @GetMapping("/{id}")
    public DetailValeurDTO getDetail(@PathVariable Integer id) {
        return service.getDetail(id);
    }

    @PostMapping("/{id}/decision")
    public ResponseEntity<DetailValeurDTO> decider(
            @PathVariable Integer id,
            @Valid @RequestBody DecisionRequestDTO decision
    ) {
        return ResponseEntity.ok(service.enregistrerDecision(id, decision));
    }
}