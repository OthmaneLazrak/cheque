import React,{ useEffect, useState } from 'react';
import api from '../services/api';
import { messageErreur } from '../utils/erreurs';
import { CelluleReponseIA } from '../components/CelluleIA';
import { BadgeStatut } from '../components/BadgeStatut';
import { traceSpecimen, traceCheque } from '../utils/signatures';
import './VerificationSignature.css';

/* ================================================================
   Types -- miroir des DTO Java
   ================================================================ */
type ReponseIA = {
  verdict: 'O' | 'N';
  score: number;
};

type ValeurEnAttente = {
  numeroInfovalBcm: number;
  numeroValeur: string;
  numeroCompte: string;
  beneficiaire: string | null;
  montant: number;
  codeBanqueRemettante: string | null;
  etatTraiter: string;
  reponseIa: ReponseIA | null;
  version: number;
  flagVerifSigna: string | null;      // conformité agence (niveau 1)
  flagVerifSignaCtr: string | null;   // conformité contrôleur (niveau 2)
  flagTraiter: string | null;
  detailMotifRejet: string | null;
  dateCreation: string | null;
};

type Specimen = {
  nomTitulaire: string;
  dateDepot: string;
  urlImage: string;
};

type DetailValeur = {
  numeroInfovalBcm: number;
  numeroValeur: string;
  numeroCompte: string;
  beneficiaire: string | null;
  montant: number;
  referenceValeur: string | null;
  dateJournee: string;
  etatTraiter: string;
  flagVerifSigna: string | null;
  reponseIa: ReponseIA | null;
  version: number;
  urlImageCheque: string | null;
  specimen: Specimen | null;
};

/* ================================================================
   Constantes
   ================================================================ */
const MOTIFS_REJET: Record<string, string> = {
  '12': 'Signature non conforme au spécimen',
  '13': 'Signature absente',
  '14': 'Spécimen non déposé ou périmé',
};

const TAILLE_PAGE = 10;
const AGENCE = '0142';
const UTILISATEUR = 'BRAIS';

/** Seul état où l'agent peut encore trancher. */
const A_TRAITER = 'A_VERIFIER_N3';

/* ================================================================
   Helpers d'affichage
   ================================================================ */
const formatMontant = (n: number) =>
  n.toLocaleString('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function afficherFlag(valeur: string | null) {
  if (valeur === 'O') return <span className="flag flag-oui">Oui</span>;
  if (valeur === 'N') return <span className="flag flag-non">Non</span>;
  return <span className="flag flag-vide">—</span>;
}

/* ================================================================
   Composant
   ================================================================ */
function VerificationSignature() {
  const [donnees, setDonnees] = useState<ValeurEnAttente[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailValeur | null>(null);
  const [motif, setMotif] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [ouvertes, setOuvertes] = useState<Set<number>>(new Set());
  const [filtreEtat, setFiltreEtat] = useState<string>('TOUS');

  function basculer(id: number) {
    setOuvertes((avant) => {
      const suite = new Set(avant);
      if (suite.has(id)) suite.delete(id);
      else suite.add(id);
      return suite;
    });
  }
  /* ---- chargement initial ---- */
  useEffect(() => {
    api
      .get<ValeurEnAttente[]>('/file-attente', { params: { agence: AGENCE } })
      .then((r) => setDonnees(r.data))
      .catch((e) => setErreur(messageErreur(e)))
      .finally(() => setChargement(false));
  }, []);

  
 /* ---- revenir page 1 quand le filtre change ---- */
  useEffect(() => {
    setPage(1);
  }, [filtreEtat]);

  /* ---- ne pas rester bloqué sur une page devenue vide ---- */
  useEffect(() => {
    const max = Math.max(1, Math.ceil(
      (filtreEtat === 'TOUS'
        ? donnees.length
        : donnees.filter((l) => l.etatTraiter === filtreEtat).length
      ) / TAILLE_PAGE
    ));
    if (page > max) setPage(max);
  }, [page, donnees, filtreEtat]);

  /* ---- fermeture de la modale avec Échap ---- */
  useEffect(() => {
    function surEchap(e: KeyboardEvent) {
      if (e.key === 'Escape') setDetail(null);
    }
    window.addEventListener('keydown', surEchap);
    return () => window.removeEventListener('keydown', surEchap);
  }, []);

  useEffect(() => {
  setPage(1);
}, [filtreEtat]);
  

  /* ---- actions ---- */
  function ouvrirDetail(id: number) {
    setMotif('');
    setMessage(null);
    api
      .get<DetailValeur>(`/${id}`)
      .then((r) => setDetail(r.data))
      .catch((e) => setErreur(messageErreur(e)));
  }

  function decider(choix: 'VALIDER' | 'REJETER') {
    if (!detail) return;

    setEnvoi(true);
    setMessage(null);

    api
      .post<DetailValeur>(`/${detail.numeroInfovalBcm}/decision`, {
        decision: choix,
        codeMotifImpaye: choix === 'REJETER' ? motif : null,
        codeUtilisateur: UTILISATEUR,
        version: detail.version,
      })
      .then((r) => {
        const maj = r.data;
        setMessage(choix === 'VALIDER' ? 'Chèque validé.' : 'Chèque rejeté.');

        // La ligne reste dans le tableau : seuls son statut et
        // son indicateur « traité » changent.
        setDonnees((avant) =>
          avant.map((l) =>
            l.numeroInfovalBcm === maj.numeroInfovalBcm
              ? {
                  ...l,
                  etatTraiter: maj.etatTraiter,
                  flagVerifSigna: maj.flagVerifSigna,
                  flagTraiter: 'O',
                  detailMotifRejet:
                  choix === 'REJETER' ? MOTIFS_REJET[motif] : null,
                  version: maj.version,
                }
              : l
          )
        );

        setDetail(maj);
        setTimeout(() => setDetail(null), 900);
      })
      .catch((e) => setMessage(messageErreur(e)))
      .finally(() => setEnvoi(false));
  }

  /* ---- rendu ---- */
  if (chargement) return <p className="etat-page">Chargement…</p>;
  if (erreur) return <p className="etat-page erreur">{erreur}</p>;

  const donneesFiltrees =
    filtreEtat === 'TOUS'
      ? donnees
      : donnees.filter((l) => l.etatTraiter === filtreEtat);

  const totalPages = Math.max(1, Math.ceil(donneesFiltrees.length / TAILLE_PAGE));
  const debut = (page - 1) * TAILLE_PAGE;
  const lignesPage = donneesFiltrees.slice(debut, debut + TAILLE_PAGE);
  const restants = donnees.filter((l) => l.etatTraiter === A_TRAITER).length;
  const dejaTranche = detail !== null && detail.etatTraiter !== A_TRAITER;
  

  return (
    <div className="page-verif">
      <h1>Vérification de signature</h1>
      <div className="barre-filtres">
  {[
    ['TOUS', 'Tous'],
    ['A_VERIFIER_N3', 'À vérifier'],
    ['VALIDE', 'Validés'],
    ['REJETE', 'Rejetés'],
  ].map(([valeur, libelle]) => {
    const nb =
      valeur === 'TOUS'
        ? donnees.length
        : donnees.filter((l) => l.etatTraiter === valeur).length;

    return (
      <button
        key={valeur}
        className="puce-filtre"
        aria-pressed={filtreEtat === valeur}
        onClick={() => setFiltreEtat(valeur)}
      >
        {libelle}
        <span className="puce-nb">{nb}</span>
      </button>
      );
    })}
  </div>

      <div className="tableau-cadre">
        <table>
          <thead>
            <tr>
              <th className="col-chevron"></th>
              <th>Numéro</th>
              <th>Bénéficiaire</th>
              <th className="col-mono">Compte</th>
              <th className="col-montant">Montant</th>
              <th className="col-ia">Réponse IA</th>
              <th className="col-ia">Score</th>
              <th>Statut</th>
              <th className="col-actions"></th>
            </tr>
          </thead>
          <tbody>
           {lignesPage.map((ligne) => {
    const estOuverte = ouvertes.has(ligne.numeroInfovalBcm);

    return (
      <React.Fragment key={ligne.numeroInfovalBcm}>
        <tr>
          <td className="col-chevron">
            <button
              className="btn-chevron"
              onClick={() => basculer(ligne.numeroInfovalBcm)}
              aria-expanded={estOuverte}
              aria-label={estOuverte ? 'Masquer le détail' : 'Afficher le détail'}
            >
              {estOuverte ? '▾' : '▸'}
            </button>
          </td>
          <td className="col-mono">{ligne.numeroValeur}</td>
          <td><div className="col-benef">{ligne.beneficiaire ?? '—'}</div></td>
          <td className="col-mono">{ligne.numeroCompte}</td>
          <td className="col-montant">{formatMontant(ligne.montant)}</td>
          <td className="col-ia"><CelluleReponseIA reponse={ligne.reponseIa} /></td>
          <td><BadgeStatut etat={ligne.etatTraiter} /></td>
          <td className="col-actions">
            <button
              className="btn-icone"
              title="Consulter"
              onClick={() => ouvrirDetail(ligne.numeroInfovalBcm)}
            >
              👁
            </button>
          </td>
        </tr>

         {estOuverte && (
          <tr className="ligne-detail">
            <td colSpan={9}>
              <div className="detail-grille">
                <div>
                  <span className="detail-label">Banque remettante</span>
                  <span className="detail-valeur mono">
                    {ligne.codeBanqueRemettante ?? '—'}
                  </span>
                </div>
                <div>
                  <span className="detail-label">Conformité agence</span>
                  <span className="detail-valeur">
                    {afficherFlag(ligne.flagVerifSigna)}
                  </span>
                </div>
                <div>
                  <span className="detail-label">Conformité contrôleur</span>
                  <span className="detail-valeur">
                    {afficherFlag(ligne.flagVerifSignaCtr)}
                  </span>
                </div>
                <div>
                  <span className="detail-label">Traité</span>
                  <span className="detail-valeur">
                    {afficherFlag(ligne.flagTraiter)}
                  </span>
                </div>
                <div>
                  <span className="detail-label">Date création</span>
                  <span className="detail-valeur mono">
                    {ligne.dateCreation ?? '—'}
                  </span>
                </div>
                <div className="detail-large">
                  <span className="detail-label">Motif de rejet</span>
                  <span className="detail-valeur">
                    {ligne.detailMotifRejet ?? '—'}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
              })}


            {lignesPage.length === 0 && (
              <tr>
                <td colSpan={14} className="tableau-vide">
                  Aucun chèque à vérifier.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pagination-info">
            {donnees.length === 0
              ? '0 résultat'
              : `${debut + 1}–${Math.min(debut + TAILLE_PAGE, donnees.length)} sur ${donnees.length}`}
          </span>

          <div className="pagination-boutons">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Précédent
            </button>
            <span className="pagination-page">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* ---------- modale de détail ---------- */}
      {detail && (
        <div className="voile" onClick={() => setDetail(null)}>
          <div
            className="modale"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modale-entete">
              <h2>Chèque n° {detail.numeroValeur}</h2>
              <button onClick={() => setDetail(null)} aria-label="Fermer">
                ✕
              </button>
            </div>

            <div className="modale-corps">
              <dl className="faits">
                <div>
                  <dt>Compte</dt>
                  <dd className="mono">{detail.numeroCompte}</dd>
                </div>
                <div>
                  <dt>Bénéficiaire</dt>
                  <dd>{detail.beneficiaire ?? '—'}</dd>
                </div>
                <div>
                  <dt>Montant</dt>
                  <dd className="mono">{formatMontant(detail.montant)} DH</dd>
                </div>
                <div>
                  <dt>Titulaire du compte</dt>
                  <dd>{detail.specimen?.nomTitulaire ?? '—'}</dd>
                </div>
              </dl>

              <div className="signatures">
                <div className="signature">
                  <h3>Spécimen déposé</h3>
                  <small>{detail.specimen?.nomTitulaire ?? '—'}</small>
                  <svg viewBox="0 0 300 100">
                    <path
                      d={traceSpecimen(detail.numeroCompte)}
                      fill="none"
                      stroke="#16624f"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="signature">
                  <h3>Signature du chèque</h3>
                  <small>n° {detail.numeroValeur}</small>
                  <svg viewBox="0 0 300 100">
                    <path
                      d={traceCheque(detail.numeroCompte, detail.numeroInfovalBcm)}
                      fill="none"
                      stroke="#10202b"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

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
                      onClick={() => decider('VALIDER')}
                    >
                      Valider le chèque
                    </button>

                    <select
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
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
                      onClick={() => decider('REJETER')}
                    >
                      Rejeter
                    </button>
                  </>
                )}

                {message && <p className="message">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerificationSignature;