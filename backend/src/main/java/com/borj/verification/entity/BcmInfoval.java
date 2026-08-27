package com.borj.verification.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "bcm_infoval",
        schema = "borjref",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_bcminfoval_refval_dj",
                columnNames = {"reference_valeur","date_journee"}
        )
)
@Data
public class BcmInfoval {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "numero_infoval_bcm")
        private Integer numeroInfovalBcm;

        @Column(name = "numero_compte", nullable = false, length = 16)
        private String numeroCompte;

        @Column(name = "numero_valeur", nullable = false, length = 7)
        private String numeroValeur;

        @Column(name = "numero_ordre", length = 6)
        private String numeroOrdre;

        @Column(name = "reference_valeur", length = 32)
        private String referenceValeur;

        @Column(name = "rib_destinataire", length = 24)
        private String ribDestinataire;

        @Column(name = "montant", nullable = false, precision = 15, scale = 2)
        private BigDecimal montant;

        @Column(name = "beneficiaire", length = 60)
        private String beneficiaire;

        @Column(name = "code_banque_remettante", length = 4)
        private String codeBanqueRemettante;

        @Column(name = "type_saisie", length = 1)
        private String typeSaisie;

        @Column(name = "statut_valeur", length = 3)
        private String statutValeur;

        @Column(name = "flag_physique", length = 1)
        private String flagPhysique;

        @Column(name = "dhs_convertible", length = 1)
        private String dhsConvertible;

        @Column(name = "capture_cmc7", length = 1)
        private String captureCmc7;

        @Column(name = "zone_certification", length = 1)
        private String zoneCertification;

        @Column(name = "etat_traiter", length = 15)
        private String etatTraiter;

        @Column(name = "etat_traiter_init", length = 15)
        private String etatTraiterInit;

        @Column(name = "etat_traitement", length = 1)
        private String etatTraitement;

        @Column(name = "flag_traiter", length = 1)
        private String flagTraiter;

        @Column(name = "operationid_traiter")
        private Integer operationidTraiter;

        @Column(name = "code_motif_impaye", length = 2)
        private String codeMotifImpaye;

        @Column(name = "detail_motif_rejet", length = 60)
        private String detailMotifRejet;

        @Column(name = "pv_ligne_recue", length = 500)
        private String pvLigneRecue;

        @Column(name = "declaration_incident_scip")
        private Short declarationIncidentScip;

        @Column(name = "cumul_edition_certificat")
        private Short cumulEditionCertificat;

        @Column(name = "date_creation", length = 10)
        private String dateCreation;

        @Column(name = "lieu_creation", length = 3)
        private String lieuCreation;

        @Column(name = "agence_creation", length = 4)
        private String agenceCreation;

        @Column(name = "code_utilisateur", length = 8)
        private String codeUtilisateur;

        @Column(name = "date_journee")
        private LocalDate dateJournee;

        @Column(name = "flag_verif_signa", length = 1)
        private String flagVerifSigna;

        @Column(name = "flag_verif_signa_ctr", length = 1)
        private String flagVerifSignaCtr;

        @Column(name = "code_utilisateur_ctr", length = 8)
        private String codeUtilisateurCtr;

        @Column(name = "reponse_ia", length = 1)
        private String reponseIa;

        @Column(name = "score_confiance_ia", precision = 5, scale = 4)
        private BigDecimal scoreConfianceIa;

        @Version
        @Column(name = "version", nullable = false)
        private Long version;
}
