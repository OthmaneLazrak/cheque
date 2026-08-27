package com.borj.verification.service;

import com.borj.verification.dto.DecisionRequestDTO;
import com.borj.verification.dto.DetailValeurDTO;
import com.borj.verification.dto.ResultatIARequestDTO;
import com.borj.verification.dto.ValeurEnAttenteDTO;
import com.borj.verification.entity.BcmInfoval;
import com.borj.verification.exception.ResultatDejaEnregistreException;
import com.borj.verification.exception.VersionConflictException;
import com.borj.verification.mapper.BcmInfovalMapper;
import com.borj.verification.repository.BcmInfoValRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class VerificationServiceImpl implements VerificationService {

    private static final Logger log =
            LoggerFactory.getLogger(VerificationServiceImpl.class);
    /** Libelles des motifs de rejet, alignes sur ceux du front. */
    private static final Map<String, String> LIBELLES_MOTIFS = Map.of(
            "12", "Signature non conforme au specimen",
            "13", "Signature absente",
            "14", "Specimen non depose ou perime"
    );

    /** Seul etat ou l'agent peut encore trancher. */
    private static final String A_TRAITER = "A_VERIFIER_N3";

    private final BcmInfoValRepository repository;
    private final BcmInfovalMapper mapper;
    private final SpecimenSimuleService specimenService;

    public VerificationServiceImpl(BcmInfoValRepository repository,
                                   BcmInfovalMapper mapper,
                                   SpecimenSimuleService specimenService) {
        this.repository = repository;
        this.mapper = mapper;
        this.specimenService = specimenService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ValeurEnAttenteDTO> getFileAttente(String agenceCreation,
                                                   LocalDate dateJournee) {
        return repository.findFileAttenteN3(agenceCreation, dateJournee)
                .stream()
                .map(mapper::toValeurEnAttenteDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DetailValeurDTO getDetail(Integer numeroInfovalBcm) {
        return versDetail(chargerOuEchouer(numeroInfovalBcm));
    }

    @Override
    @Transactional
    public void enregistrerResultatIA(ResultatIARequestDTO resultat) {
        BcmInfoval infoval = chargerOuEchouer(resultat.numeroInfovalBcm());

        // Idempotence : un second callback ne doit pas ecraser le premier.
        // Sans ce controle, un rejeu apres la decision de l'agent
        // introduirait une incoherence silencieuse.
        if (infoval.getReponseIa() != null) {
            log.warn("Callback IA ignore : resultat deja present pour {}",
                    resultat.numeroInfovalBcm());
            throw new ResultatDejaEnregistreException(resultat.numeroInfovalBcm());
        }

        infoval.setReponseIa(resultat.verdict());
        infoval.setScoreConfianceIa(resultat.score());
        repository.save(infoval);

        log.info("Resultat IA enregistre pour {} : {} ({})",
                resultat.numeroInfovalBcm(), resultat.verdict(), resultat.score());
    }

    @Override
    @Transactional
    public DetailValeurDTO enregistrerDecision(Integer numeroInfovalBcm,
                                               DecisionRequestDTO decision) {

        BcmInfoval infoval = chargerOuEchouer(numeroInfovalBcm);

        // --- 1. verrou optimiste, verifie avant tout le reste -----------
        if (!infoval.getVersion().equals(decision.version())) {
            throw new VersionConflictException(
                    "Cette valeur a ete modifiee entre-temps (version en base "
                            + infoval.getVersion() + ", version envoyee "
                            + decision.version() + "). Merci de rafraichir.");
        }

        // --- 2. la decision ne se prend qu'une fois --------------------
        if (!A_TRAITER.equals(infoval.getEtatTraiter())) {
            throw new IllegalStateException(
                    "Cette valeur n'est plus en attente de verification");
        }

        boolean valide = decision.estValidation();

        // --- 3. coherence de la demande --------------------------------
        String codeMotif = decision.codeMotifImpaye();
        if (!valide) {
            if (codeMotif == null || codeMotif.isBlank()) {
                throw new IllegalArgumentException(
                        "Un motif d'impaye est obligatoire pour rejeter");
            }
            if (!LIBELLES_MOTIFS.containsKey(codeMotif)) {
                throw new IllegalArgumentException(
                        "Motif d'impaye inconnu : " + codeMotif);
            }
        }

        // --- 4. application de la decision -----------------------------
        infoval.setFlagVerifSigna(valide ? "O" : "N");
        infoval.setFlagTraiter("O");
        infoval.setEtatTraiter(valide ? "VALIDE" : "REJETE");
        infoval.setCodeUtilisateur(decision.codeUtilisateur());
        infoval.setCodeMotifImpaye(valide ? null : codeMotif);
        infoval.setDetailMotifRejet(valide ? null : LIBELLES_MOTIFS.get(codeMotif));

        // saveAndFlush : sans le flush, Hibernate n'a pas encore
        // incremente @Version et le DTO renverrait une version perimee.
        BcmInfoval sauve = repository.saveAndFlush(infoval);

        // --- 5. trace de l'ecart avec l'IA -----------------------------
        // Donnee cle pour evaluer le modele et calibrer le seuil.
        if (sauve.getReponseIa() != null) {
            String choixAgent = valide ? "O" : "N";
            if (!sauve.getReponseIa().equals(choixAgent)) {
                log.info("DESACCORD IA/agent sur {} : IA={} (score {}), agent={}",
                        numeroInfovalBcm, sauve.getReponseIa(),
                        sauve.getScoreConfianceIa(), choixAgent);
            }
        }

        return versDetail(sauve);
    }
    // ------------------------------------------------------------------
    private BcmInfoval chargerOuEchouer(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cheque introuvable: " + id));
    }

    private DetailValeurDTO versDetail(BcmInfoval infoval) {
        return mapper.toDetailValeurDTO(
                infoval,
                specimenService.urlImageCheque(infoval.getNumeroInfovalBcm()),
                specimenService.genererPour(infoval.getNumeroCompte())
        );
    }
}