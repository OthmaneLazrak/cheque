import axios from 'axios';

/** Forme du corps d'erreur renvoyé par GlobalExceptionHandler. */
type ApiError = {
  code: string;
  message: string;
  timestamp: string;
};

/**
 * Transforme une erreur axios en message lisible pour l'agent.
 * Privilégie le message métier renvoyé par le back plutôt qu'un
 * code HTTP brut.
 */
export function messageErreur(e: unknown): string {
  if (axios.isAxiosError<ApiError>(e)) {
    if (e.response?.data?.message) return e.response.data.message;
    if (!e.response) {
      return "Serveur injoignable. L'application est-elle démarrée ?";
    }
    return `Erreur ${e.response.status}`;
  }
  return 'Erreur inattendue';
}