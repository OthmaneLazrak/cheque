package com.borj.verification.dto;

import com.borj.verification.dto.ReponseIADTO;

import java.math.BigDecimal;

public record ValeurEnAttenteDTO(
        Integer numeroInfovalBcm,
        String numeroValeur,
        String numeroCompte,
        String beneficiaire,
        BigDecimal montant,
        String codeBanqueRemettante,
        String etatTraiter,
        ReponseIADTO reponseIa,
        Long version,
        // --- ajouts ---
        String flagVerifSigna,
        String flagVerifSignaCtr,
        String flagTraiter,
        String detailMotifRejet,
        String dateCreation
) {}