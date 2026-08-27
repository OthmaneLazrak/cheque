import api from './api';
import type {
  DetailValeur,
  Decision,
  ValeurEnAttente,
} from '../types/verification';

export function chargerFileAttente(agence: string) {
  return api
    .get<ValeurEnAttente[]>('/file-attente', { params: { agence } })
    .then((r) => r.data);
}

export function chargerDetail(id: number) {
  return api.get<DetailValeur>(`/${id}`).then((r) => r.data);
}

export function envoyerDecision(
  id: number,
  decision: Decision,
  codeMotifImpaye: string | null,
  codeUtilisateur: string,
  version: number,
) {
  return api
    .post<DetailValeur>(`/${id}/decision`, {
      decision,
      codeMotifImpaye,
      codeUtilisateur,
      version,
    })
    .then((r) => r.data);
}