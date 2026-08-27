package com.borj.verification.dto;

import java.math.BigDecimal;

public record ResultatIARequestDTO(
        Integer numeroInfovalBcm, // necessaire pour retrouver la valeur
        String verdict,      // "O" / "N" / null si non analysable
        BigDecimal score      // null si verdict est null
) {}