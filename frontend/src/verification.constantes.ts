/**
 * Vocabulaire metier et helpers d'affichage.
 *
 * ATTENTION -- MOTIFS_REJET existe aussi cote Java
 * (VerificationServiceImpl.LIBELLES_MOTIFS). Toute modification
 * doit etre faite aux deux endroits, jusqu'a ce qu'un endpoint
 * GET /motifs-rejet centralise la liste.
 */

export const MOTIFS_REJET: Record<string, string> = {
  '12': 'Signature non conforme au spécimen',
  '13': 'Signature absente',
  '14': 'Spécimen non déposé ou périmé',
};

export const TAILLE_PAGE = 10;
export const AGENCE = '0142';
export const UTILISATEUR = 'OLAZREK';

/** Seul état où l'agent peut encore trancher. */
export const A_TRAITER = 'A_VERIFIER_N3';

/** Options de la barre de filtres. */
export const FILTRES: [string, string][] = [
  ['TOUS', 'Tous'],
  ['A_VERIFIER_N3', 'À vérifier'],
  ['VALIDE', 'Validés'],
  ['REJETE', 'Rejetés'],
];

export const formatMontant = (n: number) =>
  n.toLocaleString('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });