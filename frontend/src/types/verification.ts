/**
 * Miroir TypeScript des DTO Java.
 * Toute modification cote back doit etre repercutee ici.
 */

export type ReponseIA = {
  verdict: 'O' | 'N';
  score: number;
};

/** Une ligne du tableau -- GET /file-attente */
export type ValeurEnAttente = {
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

export type Specimen = {
  nomTitulaire: string;
  dateDepot: string;
  urlImage: string;
};

/** Détail d'une valeur -- GET /{id} */
export type DetailValeur = {
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

export type Decision = 'VALIDER' | 'REJETER';