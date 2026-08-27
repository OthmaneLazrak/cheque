# Verification de signatures de cheques

Application web de verification de signatures. Le projet comprend :

- une interface React/TypeScript ;
- un service FastAPI qui simule l'analyse IA ;
- un backend Spring attendu sur le port `8081` pour les donnees metier et le callback IA.

## Prerequis

- Node.js 18 ou version plus recente ;
- npm ;
- Python 3.10 ou version plus recente ;
- le backend Spring lance localement sur `http://localhost:8081`.

## Installation

Depuis la racine du projet :

```bash
npm install
```

Pour installer les dependances du service Python :

```bash
python -m venv .venv
```

Activation sous Windows PowerShell :

```powershell
.\.venv\Scripts\Activate.ps1
```

Puis installation des paquets :

```bash
python -m pip install fastapi uvicorn httpx pydantic
```

## Lancement

Lancer le frontend dans un terminal :

```bash
npm start
```

L'interface est disponible sur [http://localhost:3000](http://localhost:3000).

Lancer le service IA dans un second terminal, depuis la racine du projet :

```bash
python -m uvicorn python.main:app --reload --port 8000
```

Le service est disponible sur `http://localhost:8000`. Sa verification de sante est accessible sur `http://localhost:8000/health`.

Le backend Spring doit etre demarre avant de lancer une verification. Le frontend utilise `http://localhost:8081/api/verification-signature` et le service IA envoie ses resultats vers `http://localhost:8081/api/ia/resultat`.

La cle envoyee par defaut au callback IA est `cle123456`. Pour la modifier :

```powershell
$env:IA_CALLBACK_KEY = "votre-cle"
```

La meme valeur doit etre configuree cote backend Spring.

## Base de donnees et script SQL

Le depot ne contient actuellement aucun fichier SQL. Ajouter le script SQL dans un fichier tel que `database/schema.sql`, puis executer les commandes correspondant au moteur de base de donnees utilise.

La partie suivante est volontairement reservee en haut du futur script SQL :

```sql
-- ================================================================
-- A COMPLETER EN PREMIER : configuration et variables SQL du projet
-- ================================================================

-- Exemple : selection de la base, schema ou options propres au SGBD.
-- Ajouter ici les commandes necessaires avant le reste du script.
```

## Scripts npm

```bash
npm test       # lance les tests en mode interactif
npm run build  # genere la version de production dans build/
```

## Structure utile

- `src/` : interface React, composants, pages et services API ;
- `python/main.py` : service FastAPI de simulation IA ;
- `public/` : fichiers statiques ;
- `dec.json` et `rej.json` : donnees JSON utilisees par l'application.

## Depannage rapide

- `ECONNREFUSED localhost:8081` : verifier que le backend Spring est demarre ;
- erreur de callback IA : verifier `IA_CALLBACK_KEY` et l'URL du backend ;
- port `3000` deja utilise : Create React App proposera automatiquement un autre port.
