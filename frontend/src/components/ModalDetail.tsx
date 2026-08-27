import { traceSpecimen, traceCheque } from '../utils/signatures';
import { MOTIFS_REJET, formatMontant } from '../verification.constantes';
import type { Decision, DetailValeur } from '../types/verification';

/* ================================================================
   Comparaison des deux signatures
   ================================================================ */
function Signatures({ detail }: { detail: DetailValeur }) {
  return (
    <div className="signatures">
      <figure className="signature">
        <h3>Spécimen déposé</h3>
        <small>{detail.specimen?.nomTitulaire ?? '—'}</small>
        <svg viewBox="0 0 300 100" role="img" aria-label="Spécimen déposé">
          <path
            d={traceSpecimen(detail.numeroCompte)}
            fill="none"
            stroke="#16624f"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </figure>

      <figure className="signature">
        <h3>Signature du chèque</h3>
        <small>n° {detail.numeroValeur}</small>
        <svg viewBox="0 0 300 100" role="img" aria-label="Signature présentée">
          <path
            d={traceCheque(detail.numeroCompte, detail.numeroInfovalBcm)}
            fill="none"
            stroke="#10202b"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </figure>
    </div>
  );
}

/* ================================================================
   Zone de décision
   ================================================================ */
type DecisionProps = {
  detail: DetailValeur;
  dejaTranche: boolean;
  motif: string;
  onMotif: (m: string) => void;
  envoi: boolean;
  message: string | null;
  onDecider: (choix: Decision) => void;
};

function ZoneDecision({
  detail,
  dejaTranche,
  motif,
  onMotif,
  envoi,
  message,
  onDecider,
}: DecisionProps) {
  return (
    <div className="decision">
      {dejaTranche ? (
        <p className="deja">
          Décision enregistrée :{' '}
          <strong>
            {detail.etatTraiter === 'VALIDE' ? 'validé' : 'rejeté'}
          </strong>
        </p>
      ) : (
        <>
          <button
            className="btn-valider"
            disabled={envoi}
            onClick={() => onDecider('VALIDER')}
          >
            Valider le chèque
          </button>

          <select
            value={motif}
            onChange={(e) => onMotif(e.target.value)}
            aria-label="Motif de rejet"
          >
            <option value="">Motif de rejet…</option>
            {Object.entries(MOTIFS_REJET).map(([code, libelle]) => (
              <option key={code} value={code}>
                {code} — {libelle}
              </option>
            ))}
          </select>

          <button
            className="btn-rejeter"
            disabled={!motif || envoi}
            onClick={() => onDecider('REJETER')}
          >
            Rejeter
          </button>
        </>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

/* ================================================================
   La modale complète
   ================================================================ */
type ModaleProps = {
  detail: DetailValeur;
  onFermer: () => void;
  dejaTranche: boolean;
  motif: string;
  onMotif: (m: string) => void;
  envoi: boolean;
  message: string | null;
  onDecider: (choix: Decision) => void;
};

export function ModaleDetail({
  detail,
  onFermer,
  dejaTranche,
  motif,
  onMotif,
  envoi,
  message,
  onDecider,
}: ModaleProps) {
  const faits: [string, string, boolean][] = [
    ['Compte', detail.numeroCompte, true],
    ['Bénéficiaire', detail.beneficiaire ?? '—', false],
    ['Montant', `${formatMontant(detail.montant)} DH`, true],
    ['Titulaire du compte', detail.specimen?.nomTitulaire ?? '—', false],
  ];

  return (
    <div className="voile" onClick={onFermer}>
      <div
        className="modale"
        role="dialog"
        aria-modal="true"
        aria-label={`Détail du chèque ${detail.numeroValeur}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modale-entete">
          <h2>Chèque n° {detail.numeroValeur}</h2>
          <button onClick={onFermer} aria-label="Fermer">
            ✕
          </button>
        </div>

        <div className="modale-corps">
          <dl className="faits">
            {faits.map(([label, valeur, mono]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className={mono ? 'mono' : ''}>{valeur}</dd>
              </div>
            ))}
          </dl>

          <Signatures detail={detail} />

          <ZoneDecision
            detail={detail}
            dejaTranche={dejaTranche}
            motif={motif}
            onMotif={onMotif}
            envoi={envoi}
            message={message}
            onDecider={onDecider}
          />
        </div>
      </div>
    </div>
  );
}