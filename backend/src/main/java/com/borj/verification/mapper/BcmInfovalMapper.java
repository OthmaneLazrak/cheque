package com.borj.verification.mapper;

import com.borj.verification.dto.DetailValeurDTO;
import com.borj.verification.dto.ReponseIADTO;
import com.borj.verification.dto.SpecimenDTO;
import com.borj.verification.dto.ValeurEnAttenteDTO;
import com.borj.verification.entity.BcmInfoval;
import org.springframework.stereotype.Component;

@Component
public class BcmInfovalMapper {

    public ValeurEnAttenteDTO toValeurEnAttenteDTO(BcmInfoval entity) {
        return new ValeurEnAttenteDTO(
                entity.getNumeroInfovalBcm(),
                entity.getNumeroValeur(),
                entity.getNumeroCompte(),
                entity.getBeneficiaire(),
                entity.getMontant(),
                entity.getCodeBanqueRemettante(),
                entity.getEtatTraiter(),
                toReponseIADTO(entity),
                entity.getVersion(),
                entity.getFlagVerifSigna(),
                entity.getFlagVerifSignaCtr(),
                entity.getFlagTraiter(),
                entity.getDetailMotifRejet(),
                entity.getDateCreation()
        );
    }
    public DetailValeurDTO toDetailValeurDTO(BcmInfoval entity,
                                             String urlImageCheque,
                                             SpecimenDTO specimen) {
        return new DetailValeurDTO(
                entity.getNumeroInfovalBcm(),
                entity.getNumeroCompte(),
                entity.getNumeroValeur(),
                entity.getNumeroOrdre(),
                entity.getReferenceValeur(),
                entity.getRibDestinataire(),
                entity.getMontant(),
                entity.getBeneficiaire(),
                entity.getCodeBanqueRemettante(),
                entity.getTypeSaisie(),
                entity.getStatutValeur(),
                entity.getFlagPhysique(),
                entity.getCaptureCmc7(),
                entity.getEtatTraiter(),
                entity.getFlagVerifSigna(),
                entity.getDetailMotifRejet(),
                entity.getDateCreation(),
                entity.getAgenceCreation(),
                entity.getCodeUtilisateur(),
                entity.getDateJournee(),
                toReponseIADTO(entity),
                entity.getVersion(),
                urlImageCheque,
                specimen
        );
    }

    private ReponseIADTO toReponseIADTO(BcmInfoval entity) {
        if (entity.getReponseIa() == null) {
            return null;   // non analyse par l'IA -> le front affiche "en attente"
        }
        return new ReponseIADTO(
                entity.getReponseIa(),
                entity.getScoreConfianceIa()
        );
    }
}