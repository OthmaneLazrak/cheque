package com.borj.verification.repository;

import com.borj.verification.entity.BcmInfoval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BcmInfoValRepository extends JpaRepository<BcmInfoval, Integer> {

    @Query(value = """
            SELECT v FROM BcmInfoval v
       WHERE v.etatTraiter IN ('A_VERIFIER_N3', 'VALIDE', 'REJETE')
         AND v.agenceCreation = :agence
         AND v.dateJournee    = :dateJournee
       ORDER BY v.scoreConfianceIa ASC NULLS FIRST, v.montant DESC
    """)

    List<BcmInfoval> findFileAttenteN3(
            @Param("agence") String agenceCreation,
            @Param("dateJournee") LocalDate dateJournee
    );


    Optional<BcmInfoval> findByNumeroInfovalBcm(Integer numeroInfovalBcm);

    long countByEtatTraiterAndAgenceCreation(String etatTraiter, String agenceCreation);
}