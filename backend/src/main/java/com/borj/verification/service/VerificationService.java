package com.borj.verification.service;

import com.borj.verification.dto.DecisionRequestDTO;
import com.borj.verification.dto.DetailValeurDTO;
import com.borj.verification.dto.ResultatIARequestDTO;
import com.borj.verification.dto.ValeurEnAttenteDTO;

import java.time.LocalDate;
import java.util.List;

public interface VerificationService {

    List<ValeurEnAttenteDTO> getFileAttente(String agenceCreation, LocalDate dateJournee);

    DetailValeurDTO getDetail(Integer numeroInfovalBcm);

    void enregistrerResultatIA(ResultatIARequestDTO resultat);

    DetailValeurDTO enregistrerDecision(Integer numeroInfovalBcm,
                                        DecisionRequestDTO decision);
}