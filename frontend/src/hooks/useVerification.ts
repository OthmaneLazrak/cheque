import { useCallback, useEffect, useMemo, useState } from 'react';
import { messageErreur } from '../utils/erreurs';
import {
  chargerDetail,
  chargerFileAttente,
  envoyerDecision,
} from '../services/verification.service';
import {
  AGENCE,
  A_TRAITER,
  MOTIFS_REJET,
  TAILLE_PAGE,
  UTILISATEUR,
} from '../verification.constantes';
import type {
  Decision,
  DetailValeur,
  ValeurEnAttente,
} from '../types/verification';

/**
 * Toute la logique de l'ecran de verification.
 * Le composant de page ne contient plus que du JSX.
 */
export function useVerification() {
  const [donnees, setDonnees] = useState<ValeurEnAttente[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const [detail, setDetail] = useState<DetailValeur | null>(null);
  const [motif, setMotif] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [filtreEtat, setFiltreEtat] = useState('TOUS');
  const [ouvertes, setOuvertes] = useState<Set<number>>(new Set());

  /* ---- chargement initial ---- */
  useEffect(() => {
    chargerFileAttente(AGENCE)
      .then(setDonnees)
      .catch((e) => setErreur(messageErreur(e)))
      .finally(() => setChargement(false));
  }, []);

  /* ---- valeurs derivees ---- */
  const donneesFiltrees = useMemo(
    () =>
      filtreEtat === 'TOUS'
        ? donnees
        : donnees.filter((l) => l.etatTraiter === filtreEtat),
    [donnees, filtreEtat],
  );

  const totalPages = Math.max(1, Math.ceil(donneesFiltrees.length / TAILLE_PAGE));
  const debut = (page - 1) * TAILLE_PAGE;
  const lignesPage = donneesFiltrees.slice(debut, debut + TAILLE_PAGE);
  const restants = donnees.filter((l) => l.etatTraiter === A_TRAITER).length;
  const dejaTranche = detail !== null && detail.etatTraiter !== A_TRAITER;

  const compter = useCallback(
    (valeur: string) =>
      valeur === 'TOUS'
        ? donnees.length
        : donnees.filter((l) => l.etatTraiter === valeur).length,
    [donnees],
  );

  /* ---- pagination ---- */
  useEffect(() => {
    setPage(1);
  }, [filtreEtat]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  /* ---- fermeture avec Echap ---- */
  useEffect(() => {
    function surEchap(e: KeyboardEvent) {
      if (e.key === 'Escape') setDetail(null);
    }
    window.addEventListener('keydown', surEchap);
    return () => window.removeEventListener('keydown', surEchap);
  }, []);

  /* ---- actions ---- */
  function basculer(id: number) {
    setOuvertes((avant) => {
      const suite = new Set(avant);
      if (suite.has(id)) suite.delete(id);
      else suite.add(id);
      return suite;
    });
  }

  function ouvrirDetail(id: number) {
    setMotif('');
    setMessage(null);
    chargerDetail(id)
      .then(setDetail)
      .catch((e) => setErreur(messageErreur(e)));
  }

  function fermerDetail() {
    setDetail(null);
    setMessage(null);
  }

  function decider(choix: Decision) {
    if (!detail) return;

    setEnvoi(true);
    setMessage(null);

    envoyerDecision(
      detail.numeroInfovalBcm,
      choix,
      choix === 'REJETER' ? motif : null,
      UTILISATEUR,
      detail.version,
    )
      .then((maj) => {
        setMessage(choix === 'VALIDER' ? 'Chèque validé.' : 'Chèque rejeté.');

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
              : l,
          ),
        );

        setDetail(maj);
        setTimeout(() => setDetail(null), 900);
      })
      .catch((e) => setMessage(messageErreur(e)))
      .finally(() => setEnvoi(false));
  }

  return {
    donnees,
    donneesFiltrees,
    lignesPage,
    restants,
    chargement,
    erreur,
    page,
    setPage,
    totalPages,
    debut,
    filtreEtat,
    setFiltreEtat,
    compter,
    ouvertes,
    basculer,
    detail,
    ouvrirDetail,
    fermerDetail,
    dejaTranche,
    motif,
    setMotif,
    envoi,
    message,
    decider,
  };
}