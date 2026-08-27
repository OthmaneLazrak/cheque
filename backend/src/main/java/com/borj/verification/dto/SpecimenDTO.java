package com.borj.verification.dto;

import java.time.LocalDateTime;

public record SpecimenDTO(
        String nomTitulaire,
        LocalDateTime dateDepot,
        String urlImage
) { }
