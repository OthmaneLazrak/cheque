package com.borj.verification.service;

import com.borj.verification.dto.SpecimenDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class SpecimenSimuleService {

    private static final String[] TITULAIRES = {
            "ALAMI Ahmed",
            "TAZI Fatima",
            "SOCIETE MARBRE SUD",
            "BENNANI Youssef",
            "COMPTOIR DU NORD SARL"
    };

    /**
     * Fabrique un specimen deterministe a partir du numero de compte :
     * le meme compte donne toujours le meme titulaire et la meme image.
     *
     * A remplacer par une lecture en base le jour ou la table
     * specimen_signature existera.
     */

    public String urlImageCheque(Integer numeroInfovalBcm) {
        if (numeroInfovalBcm == null) return null;
        return "/img/cheques/chq_" + (Math.abs(numeroInfovalBcm) % 5) + ".svg";
    }

    public SpecimenDTO genererPour(String numeroCompte) {
        int h = Math.abs(numeroCompte.hashCode());
        int i = h % TITULAIRES.length;

        LocalDate depot = LocalDate.of(
                2018 + (h % 7),
                1 + (h % 12),
                1 + (h % 28)
        );

        return new SpecimenDTO(
                TITULAIRES[i],
                depot.atStartOfDay(),
                "/img/specimens/spec_" + i + ".svg"
        );
    }
}