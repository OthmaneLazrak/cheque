package com.borj.verification.dto;

import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull; import jakarta.validation.constraints.Pattern;

public record DecisionRequestDTO(

        @NotBlank
        @Pattern(regexp = "VALIDER|REJETER",
                message = "decision doit valoir VALIDER ou REJETER")
        String decision,

        String codeMotifImpaye,

        @NotBlank
        String codeUtilisateur,

        @NotNull
        Long version

) { public boolean estValidation() { return "VALIDER".equals(decision); } }