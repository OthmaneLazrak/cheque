// components/BadgeStatut.tsx
import './BadgeStatut.css';

const LIBELLES: Record<string, string> = {
  A_VERIFIER_N3: 'À vérifier',
  VALIDE: 'Validée',
  REJETE: 'Rejetée',
};

export function BadgeStatut({ etat }: { etat: string }) {
  const classe =
    etat === 'VALIDE' ? 'valide' :
    etat === 'REJETE' ? 'rejete' :
    'attente';

  return (
    <span className={`statut statut-${classe}`}>
      {LIBELLES[etat] ?? etat}
    </span>
  );
}