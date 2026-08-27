package com.borj.verification.dto;

import java.math.BigDecimal;

public record ReponseIADTO(
        String verdict,
        BigDecimal score
) {}