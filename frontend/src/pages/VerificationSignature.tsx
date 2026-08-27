import { useVerification } from '../hooks/useVerification';
import { TableauValeurs } from '../components/TableauValeur';
import { BarreFiltres, Pagination } from '../components/BarreFiltres';
import { ModaleDetail } from '../components/ModalDetail';
import { AGENCE } from '../verification.constantes';
import './VerificationSignature.css';

/**
 * Ecran de verification de signature -- niveau 3 (agence).
 *
 * Ce composant n'assemble que des morceaux : toute la logique
 * est dans useVerification, tout le rendu dans les composants.
 */
function VerificationSignature() {
  const v = useVerification();

  if (v.chargement) return <p className="etat-page">Chargement…</p>;
  if (v.erreur) return <p className="etat-page erreur">{v.erreur}</p>;

  return (
    <div className="page-verif">
      <h1>Vérification de signature</h1>
      <p className="sous-titre">
        Agence {AGENCE} · {v.restants} à traiter sur{' '}
        {v.donnees.length}
      </p>

      <BarreFiltres
        actif={v.filtreEtat}
        onChanger={v.setFiltreEtat}
        compter={v.compter}
      />

      <div className="tableau-cadre">
        <TableauValeurs
          lignes={v.lignesPage}
          ouvertes={v.ouvertes}
          onBasculer={v.basculer}
          onConsulter={v.ouvrirDetail}
        />

        <Pagination
          page={v.page}
          totalPages={v.totalPages}
          debut={v.debut}
          total={v.donneesFiltrees.length}
          onChanger={v.setPage}
        />
      </div>

      {v.detail && (
        <ModaleDetail
          detail={v.detail}
          onFermer={v.fermerDetail}
          dejaTranche={v.dejaTranche}
          motif={v.motif}
          onMotif={v.setMotif}
          envoi={v.envoi}
          message={v.message}
          onDecider={v.decider}
        />
      )}
    </div>
  );
}

export default VerificationSignature;