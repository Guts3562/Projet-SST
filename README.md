# SST Tunisie

### Plateforme pédagogique de sensibilisation à la santé et à la sécurité au travail

Projet académique réalisé dans le cadre des études en **Santé et Sécurité au Travail (SST)**. L’application propose un espace numérique pour découvrir des notions de prévention, consulter des ressources et s’exercer à l’aide d’un quiz.

> **Important — usage pédagogique**
> Cette application est un support de sensibilisation développé à des fins académiques. Elle ne remplace ni les textes officiels, ni l’avis d’un professionnel compétent, ni une évaluation des risques ou un audit de conformité. Les informations doivent être vérifiées auprès des sources officielles avant toute utilisation professionnelle.

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)

## Sommaire

- [Objectifs pédagogiques](#objectifs-pédagogiques)
- [Fonctionnalités](#fonctionnalités)
- [Architecture du projet](#architecture-du-projet)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation avec Docker](#installation-avec-docker)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Commandes utiles](#commandes-utiles)
- [Tests et limites](#tests-et-limites)
- [Structure des fichiers](#structure-des-fichiers)

## Objectifs pédagogiques

Le projet vise à rendre des contenus de sensibilisation à la SST plus accessibles et interactifs. Il permet également de mettre en pratique plusieurs notions de développement logiciel :

- concevoir une application web organisée autour d’une interface, d’une API et d’une base de données ;
- gérer l’authentification et différencier les permissions selon le rôle ;
- enregistrer et consulter des résultats d’évaluation ;
- structurer et maintenir un catalogue de questions ;
- tester les règles métier et exécuter l’application dans un environnement conteneurisé.

## Fonctionnalités

### Espace Client

- Consultation de contenus sur les risques professionnels et les mesures de prévention.
- Guide pratique et ressources d’information SST.
- Quiz avec questions sélectionnées pour une session ; le barème est appliqué côté serveur et le résultat est enregistré pour le compte connecté.
- Assistant pédagogique basé sur des réponses et des mots-clés prédéfinis. Il ne s’agit pas d’une intelligence artificielle ni d’un service de conseil officiel.
- Paramètres du compte, dont le thème et la langue de l’interface.

### Espace Administrateur

- Vue d’ensemble et consultation des comptes et résultats de quiz.
- Gestion des rôles des utilisateurs.
- Gestion du catalogue des questions : création, modification, publication, archivage ou suppression selon les contrôles de l’application.
- La publication d’une question requiert des informations de référence et de vérification de sa source.
- Journalisation des opérations administratives prises en charge par l’application.

L’interface et l’API appliquent les rôles Client et Administrateur. Les contrôles d’accès sont effectués côté serveur : masquer une option dans l’interface ne suffit pas à protéger une opération.

### Authentification et récupération

- Connexion séparée selon le type d’accès Client ou Administrateur.
- Mots de passe stockés sous forme hachée et sessions gérées par l’API.
- Récupération du mot de passe par lien à usage unique, valide 30 minutes. L’envoi des courriels nécessite une configuration SMTP.

## Architecture du projet

```text
Navigateur
   │
   ├── Interface React / Vite (port 5173)
   │       └── Requêtes /api transmises au serveur
   │
   └── API REST Node.js / Express (port 5000)
           └── PostgreSQL (port 5432)
```

Docker Compose orchestre les services de l’application et de la base de données. Le volume nommé `pgdata` conserve les données PostgreSQL entre les redémarrages des conteneurs.

## Technologies

| Partie | Technologies | Rôle |
| --- | --- | --- |
| Interface | React, Vite, CSS, Bootstrap Icons | Affichage de l’application web |
| API | Node.js, Express | Authentification, règles métier et accès aux données |
| Données | PostgreSQL 15 | Comptes, profils, questions, résultats et sessions |
| Sécurité | JWT, bcrypt, limitation de débit | Authentification, hachage des mots de passe et protection de certains points d’accès |
| Courriels | Nodemailer, SMTP | Envoi des liens de récupération de mot de passe |
| Environnement | Docker, Docker Compose | Lancement reproductible des services |
| Qualité | ESLint, Node.js Test Runner | Vérification du code et tests unitaires du backend |

## Prérequis

- Docker Desktop avec Docker Compose activé.
- Un navigateur web récent.
- Pour lancer les commandes de qualité directement sur l’ordinateur : Node.js 20.19 ou plus récent et npm.
- Une configuration SMTP est nécessaire uniquement pour envoyer réellement les courriels de récupération du mot de passe.

## Installation avec Docker

Depuis le dossier du projet, créez le fichier `.env` à partir du modèle fourni :

```powershell
Copy-Item .env.example .env
```

Si un fichier `.env` existe déjà, **ne l’écrasez pas**. Ouvrez-le et complétez les variables requises. Remplacez les secrets d’exemple par des valeurs fortes, uniques et différentes pour `DB_PASSWORD`, `JWT_SECRET` et `REFRESH_SECRET`.

Démarrez ensuite les services :

```powershell
docker compose up -d --build
```

Ouvrez l’application dans le navigateur :

- Interface web : <http://localhost:5173>
- Vérification de l’API : <http://localhost:5000/api/health>

Pour consulter l’état des conteneurs et les journaux :

```powershell
docker compose ps
docker compose logs -f app
```

Pour arrêter les services :

```powershell
docker compose down
```

Cette commande conserve les données PostgreSQL. **N’utilisez pas `docker compose down -v`** sauf si vous souhaitez explicitement supprimer le volume de base de données et toutes ses données.

## Configuration

Les variables sont définies dans le fichier `.env` à la racine du projet. Le modèle [.env.example](./.env.example) contient la liste des paramètres attendus.

### Accès administrateur

Pour attribuer le rôle Administrateur à un compte :

1. Inscrivez d’abord le compte depuis l’écran de création de compte Client.
2. Définissez `ADMIN_EMAIL` dans `.env` avec l’adresse exacte utilisée pour ce compte.
3. Redémarrez le service applicatif afin que la configuration soit prise en compte :

   ```powershell
   docker compose up -d --force-recreate app
   ```

L’adresse configurée doit correspondre à un compte existant. L’API vérifie le rôle pour les opérations d’administration.

### Courriels de récupération de mot de passe

Les paramètres SMTP sont facultatifs pour le démarrage de l’application, mais nécessaires pour envoyer les liens de récupération. Exemple de configuration Gmail :

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=adresse-expediteur@gmail.com
SMTP_PASSWORD=mot-de-passe-d-application
SMTP_FROM=adresse-expediteur@gmail.com
```

Utilisez un **mot de passe d’application** fourni par Google si votre compte le permet, et non le mot de passe normal du compte. Pour un autre fournisseur, utilisez ses paramètres SMTP. Ne partagez jamais ces identifiants et ne les ajoutez pas au dépôt Git. Après modification, recréez le conteneur applicatif :

```powershell
docker compose up -d --force-recreate app
```

Les jetons de réinitialisation sont à usage unique et expirent au bout de 30 minutes. Si SMTP n’est pas configuré ou est indisponible, la récupération par courriel ne peut pas aboutir.

### Base de données

Les paramètres PostgreSQL sont également définis dans `.env`. Le script [db-init/init.sql](./db-init/init.sql) prépare le schéma lors de l’initialisation d’une nouvelle base. Le service applicatif prend en charge les migrations complémentaires prévues au démarrage.

Sur une base déjà créée, modifier `DB_PASSWORD` dans `.env` ne change pas automatiquement le mot de passe du rôle PostgreSQL existant.

## Utilisation

1. Ouvrez l’application et choisissez le type de connexion.
2. Créez un compte Client ou connectez-vous avec un compte existant.
3. Parcourez les rubriques pédagogiques, puis réalisez le quiz.
4. Pour administrer les comptes ou les questions, connectez-vous avec un compte auquel le rôle Administrateur a été attribué.

## Commandes utiles

À exécuter depuis la racine du projet, avec les dépendances installées :

| Commande | Description |
| --- | --- |
| `npm run lint` | Analyse le code avec ESLint |
| `npm test` | Exécute les tests unitaires du backend |
| `npm run build` | Compile l’interface pour la production |
| `npm run dev` | Lance l’interface et l’API en mode développement local |

Le mode de développement local nécessite également une base PostgreSQL accessible et un fichier `.env` adapté à cet environnement. Pour une première utilisation, le lancement avec Docker Compose est recommandé.

## Tests et limites

Les tests automatisés actuels couvrent notamment les règles de validation des questions, le calcul et la validation des réponses du quiz, ainsi que des fonctions liées à la récupération du mot de passe. Ils ne remplacent pas des tests complets de sécurité, d’accessibilité, d’utilisabilité ou de conformité réglementaire.

Les informations relatives aux obligations, normes, organismes, coordonnées ou numéros d’urgence doivent être revérifiées à partir des sources officielles pertinentes et de leur version en vigueur. La rubrique **Ressources** de l’application fournit des liens de référence, mais la présence d’un lien ne garantit pas à elle seule l’exactitude ou l’actualité de chaque contenu.

## Structure des fichiers

```text
.
├── db-init/                 # Schéma et données initiales PostgreSQL
├── public/                  # Ressources publiques de l’interface
├── server/
│   ├── index.js             # Serveur Express et routes API
│   ├── admin.js             # Règles métier liées à l’administration
│   ├── quiz.js              # Validation et calcul du quiz
│   └── *.test.js            # Tests unitaires du backend
├── src/
│   ├── components/          # Pages et composants React
│   ├── lib/                 # API cliente, authentification et langue
│   ├── utils/               # Données et utilitaires partagés
│   ├── App.jsx              # Application et navigation
│   └── main.jsx             # Point d’entrée React
├── docker-compose.yml       # Services applicatif et PostgreSQL
├── Dockerfile.dev           # Image de développement
└── .env.example             # Modèle de configuration locale
```

---

*Projet académique — première année, domaine Santé et Sécurité au Travail (SST), Tunisie.*
