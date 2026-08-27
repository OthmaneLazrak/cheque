# Verification de signatures de cheques

Application de verification manuelle de signatures de cheques avec un resultat IA simule en base de donnees.
Le projet est compose de deux parties :

- `frontend/` : interface React et TypeScript pour consulter la file et prendre une decision ;
- `backend/` : API Spring Boot qui lit les valeurs dans PostgreSQL et enregistre les decisions.

## Architecture

```text
Navigateur (React :3000 ou :5173)
              |
              v
     Spring Boot :8081  <---- PostgreSQL :5433
```

Le frontend appelle le backend pour :

1. charger la file de verification de l'agence `0142` ;
2. afficher le detail d'une valeur, son image de cheque et un specimen simule ;
3. consulter le verdict et le score IA deja presents dans la base ;
4. valider ou rejeter la valeur.

Lors d'un rejet, le motif est obligatoire et doit etre l'un des suivants :

| Code | Motif |
| --- | --- |
| `12` | Signature non conforme au specimen |
| `13` | Signature absente |
| `14` | Specimen non depose ou perime |

## Technologies

- Java 17, Spring Boot 4.1, Spring Web MVC, Spring Data JPA, Hibernate, Lombok et Actuator ;
- PostgreSQL ;
- React 19, TypeScript, Create React App, Axios et `lucide-react`.

## Prerequis

- JDK 17 ;
- Node.js 18 ou plus recent et npm ;
- PostgreSQL accessible sur le port `5433` ;
- une base `borj` contenant le schema `borjref` et la table `borjref.bcm_infoval`.

Le backend utilise `spring.jpa.hibernate.ddl-auto=validate` : il ne cree ni ne modifie les tables. Le schema et les tables doivent donc exister avant le demarrage.

## Configuration

La configuration principale se trouve dans [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).

Valeurs attendues par defaut :

| Parametre | Valeur |
| --- | --- |
| API Spring | `http://localhost:8081` |
| PostgreSQL | `jdbc:postgresql://localhost:5433/borj` |
| Schema | `borjref` |
| Frontend | `http://localhost:3000` |

Le frontend utilise actuellement une URL d'API codee en dur dans [frontend/src/services/api.ts](frontend/src/services/api.ts).

## Initialiser les donnees simulees

Le script SQL de generation fourni avec le projet doit etre execute dans PostgreSQL apres la creation du schema et des tables necessaires.

Il genere 200 valeurs dans `borjref.bcm_infoval` et simule les niveaux de traitement, les decisions des niveaux precedents, les donnees des cheques ainsi que le verdict et le score IA.

La regle de coherence est `O` si le score est superieur ou egal a `0.80`, sinon `N`. Les colonnes `code_motif_impaye` et `detail_motif_rejet` restent vides jusqu'au rejet depuis l'interface.

Le script contient des requetes de controle qui doivent retourner zero incoherence. Pour afficher les valeurs dans l'application, `agence_creation` doit correspondre a l'agence utilisee par le frontend, actuellement `0142`.

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
  config/       Configuration CORS

frontend/src/
  pages/        Ecrans de verification
  components/   Tableau, filtres, badges et modales
  services/     Appels Axios vers Spring
  hooks/        Logique de chargement et de decision
  types/        Miroirs TypeScript des DTO Java
```

## Points a completer avant production

- remplacer `SpecimenSimuleService` par une source réelle des images et specimens ;
- externaliser les URLs frontend/backend et les identifiants de configuration ;
- ajouter une authentification utilisateur et une autorisation par agence ;
- fournir une migration SQL versionnee et des tests d'integration avec PostgreSQL ;
- remplacer les donnees simulees et les specimens simules par des donnees de production.