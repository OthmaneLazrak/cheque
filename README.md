# Verification de signatures de cheques

Application de verification manuelle de signatures de cheques avec comparaison IA simulee.
Le projet est compose de trois parties :

- `frontend/` : interface React et TypeScript pour consulter la file et prendre une decision ;
- `backend/` : API Spring Boot qui lit les valeurs dans PostgreSQL et enregistre les decisions ;
- `frontend/python/` : service FastAPI qui genere un resultat IA aleatoire et tente de le transmettre au backend.

## Architecture

```text
Navigateur (React :3000 ou :5173)
              |
              v
     Spring Boot :8081  <---- PostgreSQL :5433
              ^
              |
     FastAPI IA :8000
```

Le frontend appelle le backend pour :

1. charger la file de verification de l'agence `0142` ;
2. afficher le detail d'une valeur, son image de cheque et un specimen simule ;
3. valider ou rejeter la valeur.

Lors d'un rejet, le motif est obligatoire et doit etre l'un des suivants :

| Code | Motif |
| --- | --- |
| `12` | Signature non conforme au specimen |
| `13` | Signature absente |
| `14` | Specimen non depose ou perime |

## Technologies

- Java 17, Spring Boot 4.1, Spring Web MVC, Spring Data JPA, Hibernate, Lombok et Actuator ;
- PostgreSQL ;
- React 19, TypeScript, Create React App, Axios et `lucide-react` ;
- Python 3.10 ou plus recent, FastAPI, Uvicorn, HTTPX et Pydantic.

## Prerequis

- JDK 17 ;
- Node.js 18 ou plus recent et npm ;
- Python 3.10 ou plus recent ;
- PostgreSQL accessible sur le port `5433` ;
- une base `borj` contenant le schema `borjref` et la table `borjref.bcm_infoval`.

Le backend utilise `spring.jpa.hibernate.ddl-auto=validate` : il ne cree ni ne modifie les tables. Aucun script SQL d'initialisation n'est fourni dans le depot.

## Configuration

La configuration principale se trouve dans [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).

Valeurs attendues par defaut :

| Parametre | Valeur |
| --- | --- |
| API Spring | `http://localhost:8081` |
| PostgreSQL | `jdbc:postgresql://localhost:5433/borj` |
| Schema | `borjref` |
| Frontend | `http://localhost:3000` |
| Service IA | `http://localhost:8000` |
| Cle callback IA | variable `IA_CALLBACK_KEY`, sinon `cle123456` |

Ne commitez jamais un mot de passe de base de donnees. Configurez les identifiants PostgreSQL dans votre environnement ou dans une configuration locale non versionnee avant de lancer Spring Boot.

La cle `IA_CALLBACK_KEY` doit etre identique cote Python et cote backend. Sous PowerShell :

```powershell
$env:IA_CALLBACK_KEY = "votre-cle-locale"
```

Le frontend utilise actuellement une URL d'API codee en dur dans [frontend/src/services/api.ts](frontend/src/services/api.ts).

## Installation et lancement

### Backend Spring Boot

Depuis `backend/` :

```powershell
.\mvnw.cmd spring-boot:run
```

Ou pour construire et lancer le JAR :

```powershell
.\mvnw.cmd clean package
java -jar target\bcm_info_val-0.0.1-SNAPSHOT.jar
```

L'API demarre sur `http://localhost:8081`. La sante Actuator est disponible sur `http://localhost:8081/actuator/health`.

### Frontend React

Depuis `frontend/` :

```powershell
npm install
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000). Le backend doit etre demarre et accessible depuis le navigateur.

### Service IA simule

Depuis la racine du depot :

```powershell
cd frontend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi uvicorn httpx pydantic
python -m uvicorn python.main:app --reload --port 8000
```

Verification de sante : [http://localhost:8000/health](http://localhost:8000/health).

Pour demander une analyse :

```powershell
curl -X POST http://localhost:8000/analyser `
  -H "Content-Type: application/json" `
  -d '{"numero_infoval_bcm": 123}'
```

Le resultat genere est volontairement aleatoire et ne constitue pas une vraie analyse d'image.

## API Spring

Base URL : `http://localhost:8081/api/verification-signature`

### Charger la file

```http
GET /file-attente?agence=0142&dateJournee=2026-08-27
```

`dateJournee` est optionnelle ; la date du jour est utilisee par defaut. Les valeurs sont triees par score IA croissant, puis par montant decroissant.

### Charger le detail

```http
GET /{numeroInfovalBcm}
```

La reponse contient notamment l'etat de traitement, la reponse IA, la version de concurrence, l'URL du cheque et le specimen simule.

### Enregistrer une decision

```http
POST /{numeroInfovalBcm}/decision
Content-Type: application/json

{
  "decision": "VALIDER",
  "codeMotifImpaye": null,
  "codeUtilisateur": "OLAZREK",
  "version": 0
}
```

Pour rejeter, utiliser `"decision": "REJETER"` et fournir un code de motif valide. La version envoyee doit correspondre a celle de la base ; sinon l'API renvoie `409 VERSION_CONFLICT`. Une valeur ne peut etre decidee que lorsqu'elle est dans l'etat `A_VERIFIER_N3`.

Les erreurs sont renvoyees sous la forme :

```json
{
  "code": "VERSION_CONFLICT",
  "message": "...",
  "timestamp": "..."
}
```

## Integration IA : etat actuel

Le service FastAPI envoie le resultat vers :

```text
POST http://localhost:8081/api/ia/resultat
Header: X-API-Key: <IA_CALLBACK_KEY>
```

avec un payload de la forme :

```json
{
  "numeroInfovalBcm": 123,
  "verdict": "O",
  "score": 0.94
}
```

Le filtre Spring protege bien les chemins `/api/ia/**`, mais le depot ne contient actuellement aucun contrôleur qui implemente `POST /api/ia/resultat`. L'appel `/analyser` echouera donc avec une erreur HTTP tant que cet endpoint n'aura pas ete ajoute. Le parcours manuel frontend/backend reste independant de cette limitation.

## Tests et build

Backend :

```powershell
cd backend
.\mvnw.cmd test
```

Frontend :

```powershell
cd frontend
npm test
npm run build
```

Les tests frontend sont bases sur Testing Library. Le backend contient actuellement un test de chargement du contexte Spring.

## Structure utile

```text
backend/src/main/java/com/borj/verification/
  controller/   Endpoints HTTP
  service/      Regles de verification et decisions
  repository/   Acces JPA a bcm_infoval
  entity/       Mapping de la table borjref.bcm_infoval
  dto/          Contrats JSON de l'API
  config/       CORS et protection du callback IA

frontend/src/
  pages/        Ecrans de verification
  components/   Tableau, filtres, badges et modales
  services/     Appels Axios vers Spring
  hooks/        Logique de chargement et de decision
  types/        Miroirs TypeScript des DTO Java

frontend/python/main.py  Simulateur FastAPI de resultat IA
```

## Points a completer avant production

- ajouter le contrôleur Spring du callback IA ou adapter l'URL du service Python ;
- remplacer `SpecimenSimuleService` par une source réelle des images et specimens ;
- externaliser les URLs frontend/backend et les identifiants de configuration ;
- ajouter une authentification utilisateur et une autorisation par agence ;
- fournir une migration SQL versionnee et des tests d'integration avec PostgreSQL ;
- remplacer l'IA aleatoire par un modele et une gestion fiable des erreurs/reprises.