// components/PanneauFiltre.tsx
import { useState } from 'react';
import './PanneauFiltre.css';

export type Filtres = {
  numeroValeur: string;
  beneficiaire: string;
  etatTraiter: string;
  reponseIa: string;
};

const FILTRES_VIDES: Filtres = {
  numeroValeur: '',
  beneficiaire: '',
  etatTraiter: '',
  reponseIa: '',
};

function PanneauFiltre({
  onAppliquer,
}: {
  onAppliquer: (f: Filtres) => void;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [brouillon, setBrouillon] = useState<Filtres>(FILTRES_VIDES);

  function appliquer() {
    onAppliquer(brouillon);
    setOuvert(false);
  }

  function reinitialiser() {
    setBrouillon(FILTRES_VIDES);
    onAppliquer(FILTRES_VIDES);
  }

  return (
    <div className="panneau-filtre">
      <button className="btn-filtre" onClick={() => setOuvert(!ouvert)}>
        ☰ Filtrer
      </button>

      {ouvert && (
        <div className="filtre-corps">
          <div className="filtre-champ">
            <label>Numéro de valeur</label>
            <input
              value={brouillon.numeroValeur}
              onChange={(e) =>
                setBrouillon({ ...brouillon, numeroValeur: e.target.value })
              }
              placeholder="ex : 7001234"
            />
          </div>

          <div className="filtre-champ">
            <label>Bénéficiaire</label>
            <input
              value={brouillon.beneficiaire}
              onChange={(e) =>
                setBrouillon({ ...brouillon, beneficiaire: e.target.value })
              }
              placeholder="Nom du bénéficiaire"
            />
          </div>

          <div className="filtre-champ">
            <label>Statut</label>
            <select
              value={brouillon.etatTraiter}
              onChange={(e) =>
                setBrouillon({ ...brouillon, etatTraiter: e.target.value })
              }
            >
              <option value="">Tous</option>
              <option value="A_VERIFIER_N3">À vérifier</option>
              <option value="VALIDE">Validée</option>
              <option value="REJETE">Rejetée</option>
            </select>
          </div>

          <div className="filtre-champ">
            <label>Réponse IA</label>
            <select
              value={brouillon.reponseIa}
              onChange={(e) =>
                setBrouillon({ ...brouillon, reponseIa: e.target.value })
              }
            >
              <option value="">Toutes</option>
              <option value="O">Conforme</option>
              <option value="N">Non conforme</option>
              <option value="ABSENT">Non analysé</option>
            </select>
          </div>

          <div className="filtre-actions">
            <button className="btn-reinitialiser" onClick={reinitialiser}>
              Réinitialiser
            </button>
            <button className="btn-appliquer" onClick={appliquer}>
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanneauFiltre;