import { FILTRES, TAILLE_PAGE } from '../verification.constantes';

/* ================================================================
   Barre de filtres par état
   ================================================================ */
type FiltresProps = {
  actif: string;
  onChanger: (valeur: string) => void;
  compter: (valeur: string) => number;
};

export function BarreFiltres({ actif, onChanger, compter }: FiltresProps) {
  return (
    <div className="barre-filtres">
      {FILTRES.map(([valeur, libelle]) => (
        <button
          key={valeur}
          className="puce-filtre"
          aria-pressed={actif === valeur}
          onClick={() => onChanger(valeur)}
        >
          {libelle}
          <span className="puce-nb">{compter(valeur)}</span>
        </button>
      ))}
    </div>
  );
}

/* ================================================================
   Pagination
   ================================================================ */
type PaginationProps = {
  page: number;
  totalPages: number;
  debut: number;
  total: number;
  onChanger: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  debut,
  total,
  onChanger,
}: PaginationProps) {
  return (
    <div className="pagination">
      <span className="pagination-info">
        {total === 0
          ? '0 résultat'
          : `${debut + 1}–${Math.min(debut + TAILLE_PAGE, total)} sur ${total}`}
      </span>

      <div className="pagination-boutons">
        <button onClick={() => onChanger(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <span className="pagination-page">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => onChanger(page + 1)}
          disabled={page >= totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}