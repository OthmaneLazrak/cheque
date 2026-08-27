import './CelluleIA.css';


const SEUIL_CONFIANCE = 0.85;

type ReponseIA = {
  verdict: 'O' | 'N';
  score: number;
};

// --- Colonne "Réponse IA" ---
export function CelluleReponseIA({ reponse }: { reponse: ReponseIA | null }) {
  if (reponse === null) {
    return <span className="badge badge-absent">Non analysé</span>;
  }

  const douteux = reponse.score < SEUIL_CONFIANCE;
  const classe = douteux ? 'grise' : reponse.verdict === 'O' ? 'oui' : 'non';

  return (
    <span className={`badge badge-${classe}`}>
      {reponse.verdict === 'O' ? 'Oui' : 'Non'}
      {douteux && <small> à examiner</small>}
    </span>
  );
}

// --- Colonne "Score de confiance" ---
export function CelluleScoreIA({ reponse }: { reponse: ReponseIA | null }) {
  if (reponse === null) {
    return <span className="score-absent">—</span>;
  }

  const pct = Math.round(reponse.score * 100);
  const bas = reponse.score < SEUIL_CONFIANCE;

  return (
    <div className={bas ? 'score score-bas' : 'score'}>
      <span>{pct} %</span>
      <span className="piste">
        <span className="jauge" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}