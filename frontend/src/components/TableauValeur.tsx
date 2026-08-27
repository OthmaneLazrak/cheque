import React from 'react';
import { CelluleReponseIA, CelluleScoreIA } from './CelluleIA';
import { BadgeStatut } from './BadgeStatut';
import { formatMontant } from '../verification.constantes';
import type { ValeurEnAttente } from '../types/verification';

/* ================================================================
   Flag O / N / vide
   ================================================================ */
export function Flag({ valeur }: { valeur: string | null }) {
  if (valeur === 'O') return <span className="flag flag-oui">Oui</span>;
  if (valeur === 'N') return <span className="flag flag-non">Non</span>;
  return <span className="flag flag-vide">—</span>;
}

/* ================================================================
   Panneau déplié sous une ligne
   ================================================================ */
function DetailLigne({ ligne }: { ligne: ValeurEnAttente }) {
  const champs: [string, React.ReactNode, boolean][] = [
    ['Banque remettante', ligne.codeBanqueRemettante ?? '—', true],
    ['Conformité agence', <Flag valeur={ligne.flagVerifSigna} />, false],
    ['Conformité contrôleur', <Flag valeur={ligne.flagVerifSignaCtr} />, false],
    ['Traité', <Flag valeur={ligne.flagTraiter} />, false],
    ['Date création', ligne.dateCreation ?? '—', true],
  ];

  return (
    <tr className="ligne-detail">
      <td colSpan={9}>
        <div className="detail-grille">
          {champs.map(([label, valeur, mono]) => (
            <div key={label}>
              <span className="detail-label">{label}</span>
              <span className={`detail-valeur ${mono ? 'mono' : ''}`}>
                {valeur}
              </span>
            </div>
          ))}
          <div className="detail-large">
            <span className="detail-label">Motif de rejet</span>
            <span className="detail-valeur">
              {ligne.detailMotifRejet ?? '—'}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ================================================================
   Une ligne du tableau
   ================================================================ */
type LigneProps = {
  ligne: ValeurEnAttente;
  estOuverte: boolean;
  onBasculer: (id: number) => void;
  onConsulter: (id: number) => void;
};

function LigneValeur({
  ligne,
  estOuverte,
  onBasculer,
  onConsulter,
}: LigneProps) {
  return (
    <>
      <tr>
        <td className="col-chevron">
          <button
            className="btn-chevron"
            onClick={() => onBasculer(ligne.numeroInfovalBcm)}
            aria-expanded={estOuverte}
            aria-label={estOuverte ? 'Masquer le détail' : 'Afficher le détail'}
          >
            {estOuverte ? '▾' : '▸'}
          </button>
        </td>
        <td className="col-mono">{ligne.numeroValeur}</td>
        <td>
          <div className="col-benef">{ligne.beneficiaire ?? '—'}</div>
        </td>
        <td className="col-mono">{ligne.numeroCompte}</td>
        <td className="col-montant">{formatMontant(ligne.montant)}</td>
        <td className="col-ia">
          <CelluleReponseIA reponse={ligne.reponseIa} />
        </td>
        
        <td>
          <BadgeStatut etat={ligne.etatTraiter} />
        </td>
        <td className="col-actions">
          <button
            className="btn-icone"
            title="Consulter"
            aria-label={`Consulter le chèque ${ligne.numeroValeur}`}
            onClick={() => onConsulter(ligne.numeroInfovalBcm)}
          >
            👁
          </button>
        </td>
      </tr>

      {estOuverte && <DetailLigne ligne={ligne} />}
    </>
  );
}

/* ================================================================
   Le tableau complet
   ================================================================ */
type TableauProps = {
  lignes: ValeurEnAttente[];
  ouvertes: Set<number>;
  onBasculer: (id: number) => void;
  onConsulter: (id: number) => void;
};

export function TableauValeurs({
  lignes,
  ouvertes,
  onBasculer,
  onConsulter,
}: TableauProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="col-chevron"></th>
          <th>Numéro</th>
          <th>Bénéficiaire</th>
          <th className="col-mono">Compte</th>
          <th className="col-montant">Montant</th>
          <th className="col-ia">Réponse IA</th>
          <th>Statut</th>
          <th className="col-actions"></th>
        </tr>
      </thead>
      <tbody>
        {lignes.map((ligne) => (
          <React.Fragment key={ligne.numeroInfovalBcm}>
            <LigneValeur
              ligne={ligne}
              estOuverte={ouvertes.has(ligne.numeroInfovalBcm)}
              onBasculer={onBasculer}
              onConsulter={onConsulter}
            />
          </React.Fragment>
        ))}

        {lignes.length === 0 && (
          <tr>
            <td colSpan={9} className="tableau-vide">
              Aucun chèque à afficher.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}