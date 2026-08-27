package com.borj.verification.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DetailValeurDTO(
        Integer numeroInfovalBcm,
        String numeroCompte,
        String numeroValeur,
        String numeroOrdre,
        String referenceValeur,
        String ribDestinataire,
        BigDecimal montant,
        String beneficiaire,
        String codeBanqueRemettante,
        String typeSaisie,
        String statutValeur,
        String flagPhysique,
        String captureCmc7,
        String etatTraiter,
        String flagVerifSigna,
        String detailMotifRejet,
        String dateCreation,          // corrige : VARCHAR en base, pas DATE
        String agenceCreation,
        String codeUtilisateur,
        LocalDate dateJournee,        // celle-ci reste un vrai DATE
        ReponseIADTO reponseIa,
        Long version,
        String urlImageCheque,      // ou base64
        SpecimenDTO specimen        // avec nomTitulaire, dateDepot, urlImage
) {}