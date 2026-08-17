# SST Tunisie — Plateforme Web de Sensibilisation à la Santé et Sécurité au Travail

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**SST Tunisie** est une plateforme web full-stack dédiée à la sensibilisation à la **Santé et Sécurité au Travail** en Tunisie. Elle centralise les ressources réglementaires et propose des outils interactifs — assistant conversationnel, quiz d'évaluation, catalogue des risques — pour améliorer la culture de prévention auprès des professionnels, employeurs et travailleurs.

---

## 📋 Table des Matières

- [Contexte](#-contexte)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Stack Technologique](#-stack-technologique)
- [Structure du Projet](#-structure-du-projet)
- [Installation & Démarrage](#-installation--démarrage)
- [Configuration](#-configuration)
- [API & Endpoints](#-api--endpoints)
- [Docker](#-docker)
- [Design & Accessibilité](#-design--accessibilité)
- [Scripts Disponibles](#-scripts-disponibles)

---

## 📖 Contexte

La SST en Tunisie s'appuie sur un cadre réglementaire structuré : **Loi n°66-27** du 30 avril 1966, décrets d'application, normes tunisiennes (NT) et organismes comme la CNSS ou l'INRSST. Malgré ce dispositif, l'accès à l'information reste dispersé et les outils de formation interactifs sont rares.

**SST Tunisie** a été conçue pour répondre à ce manque en proposant :

- Un **point d'entrée unique** vers la réglementation, les contacts institutionnels et les numéros d'urgence
- Des **outils d'auto-évaluation** (quiz) pour mesurer et renforcer les connaissances
- Un **assistant conversationnel** spécialisé sur la législation tunisienne
- Une **interface moderne** adaptée aux usages professionnels

---

## ✨ Fonctionnalités

### 🤖 Assistant Conversationnel SST

Un assistant intégré capable de répondre aux questions courantes sur :

- Le Code du Travail tunisien (Loi n°66-27, décrets)
- Les organismes : CNSS, INRSST, Inspection du Travail
- Les EPI (Équipements de Protection Individuelle) et normes NT associées
- Les procédures d'urgence et contacts (SAMU, Protection Civile, Centre Anti-Poison)

L'assistant fonctionne via une logique de correspondance par mots-clés, avec réponses pré-écrites couvrant les cas les plus fréquents.

### 📝 Quiz d'Évaluation

Un système d'évaluation dynamique construit autour de 31 questions initialisées en base de données.

- Sélection aléatoire de 10 questions par session
- Feedback immédiat après chaque réponse
- Sauvegarde des résultats pour les utilisateurs authentifiés
- Historique consultable depuis le profil

### 🛡️ Ressources & Contacts

Répertoire structuré incluant :

- Les normes tunisiennes (NT) applicables aux EPI par secteur
- Les documents réglementaires obligatoires (DUER, registres de sécurité, FDS)
- Le répertoire des institutions : CNSS, INRSST, Inspection du Travail, UTICA, UGTT
- Les numéros d'urgence nationaux

### 🚨 Module d'Urgence

Accès rapide aux services de secours tunisiens, avec interface optimisée pour un usage mobile en situation critique.

---

## 🏗️ Architecture

```
┌─────────────────┐     REST API      ┌─────────────────┐
│   Frontend      │──────────────────►│   Backend       │
│   React 19      │   JSON / JWT      │   Express       │
│   Vite 8        │◄──────────────────│   Node.js       │
│   Native Fetch  │                   │   Bcrypt + JWT  │
└─────────────────┘                   └────────┬────────┘
        ▲                                      │
        │          ┌─────────────────┐         │ pg / TCP
        └──────────►│   Docker       │◄────────┘
                    │   Compose      │
                    │                │
                    │  ┌──────────┐  │
                    │  │  db      │  │
                    │  │ Postgres │──┘
                    │  │ 15-alp.  │
                    │  └──────────┘
                    │  ┌──────────┐
                    │  │  app     │
                    │  │ Vite     │
                    │  │ :5173    │
                    │  └──────────┘
                    └─────────────────┘
```

- **Frontend** : SPA React avec navigation par onglets et sidebar responsive. Gestion d'état via Context API. Thème clair/sombre persistant.
- **Backend** : API REST Express avec authentification JWT (access token court + refresh token en cookie httpOnly). Protection des routes par middleware.
- **Base de données** : PostgreSQL avec schéma relationnel (users, profiles, questions, quiz_results, refresh_tokens). Données initialisées via `db-init/init.sql`.

---

## 🛠️ Stack Technologique

| Couche | Technologie | Usage |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 8 | Interface SPA réactive |
| **Backend** | Node.js + Express | API REST et authentification |
| **Base de données** | PostgreSQL 15 | Stockage utilisateurs, quiz, sessions |
| **Styling** | CSS natif + variables CSS | Thème dynamique sans framework lourd |
| **Icônes** | Bootstrap Icons 1.13 | Bibliothèque d'icônes cohérente |
| **Conteneurisation** | Docker + Docker Compose | Environnement reproductible |
| **Authentification** | JWT + Bcrypt | Tokens rotatifs, cookie httpOnly |

---

## 📂 Structure du Projet

```
SST-Tunisie/
├── src/
│   ├── components/
│   │   ├── Accueil.jsx           # Page d'accueil et hero
│   │   ├── Risques.jsx           # Catalogue des risques professionnels
│   │   ├── Quiz.jsx              # Système d'évaluation interactive
│   │   ├── Chatbot.jsx           # Assistant conversationnel SST
│   │   ├── Guide.jsx             # Guide pratique de prévention
│   │   ├── Ressources.jsx        # Répertoire institutionnel et urgences
│   │   ├── Navbar.jsx            # Navigation latérale
│   │   ├── Login/
│   │   │   ├── LoginModal.jsx    # Authentification
│   │   │   ├── SettingsModal.jsx # Paramètres et thème
│   │   │   └── AuthRequired.jsx  # Accès restreint
│   │   └── LogoutConfirmModal.jsx
│   ├── lib/
│   │   ├── api.js                # Client API centralisé (fetch + refresh)
│   │   └── AuthContext.jsx        # Context React pour l'authentification
│   ├── assets/                   # Logo et images statiques
│   ├── style.css                 # Variables CSS, thèmes, base
│   ├── layout.css                # Sidebar et layout principal
│   └── main.jsx                  # Point d'entrée React
├── server/
│   ├── index.js                  # Routes API, auth, quiz, chat
│   ├── db.js                     # Connexion PostgreSQL (pg Pool)
│   └── .env                      # Variables d'environnement backend
├── db-init/
│   └── init.sql                  # Seed initial : 31 questions SST
├── docker-compose.yml            # Orchestration db + app
├── Dockerfile.dev                # Image de développement
├── package.json                  # Dépendances et scripts
└── vite.config.js                # Configuration Vite (proxy /api → :5000)
```

---

## 🚀 Installation & Démarrage

### Prérequis

- [Node.js](https://nodejs.org/) >= 18
- [PostgreSQL](https://www.postgresql.org/) >= 14
- [Docker](https://www.docker.com/) & Docker Compose (recommandé pour la base de données)

### Option 1 : Docker (Recommandé)

```bash
# Cloner le projet
git clone https://github.com/<org>/sst-tunisie.git
cd sst-tunisie

# Démarrer la base de données et l'application
docker-compose up

# Accéder à l'application
# Frontend : http://localhost:5173
# Backend  : http://localhost:5000
```

Le service `db` expose PostgreSQL sur le port 5432 et initialise automatiquement le schéma via `db-init/init.sql`.

### Option 2 : Installation Manuelle

```bash
# 1. Installer les dépendances frontend
npm install

# 2. Installer les dépendances backend
cd server
npm install

# 3. Créer la base PostgreSQL 'sst_tunisie' et exécuter db-init/init.sql

# 4. Configurer server/.env (voir section Configuration)

# 5. Démarrer en mode développement
cd ..
npm run dev
```

---

## ⚙️ Configuration

### Backend (`server/.env`)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sst_tunisie
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=<secret_access_token>
REFRESH_SECRET=<secret_refresh_token>

CLIENT_ORIGIN=http://localhost:5173
```

### Frontend

La configuration Vite se trouve dans `vite.config.js`. En développement, un proxy forwarde automatiquement `/api` vers le backend sur le port 5000.

---

## 🔌 API & Endpoints

### Authentification

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Créer un compte (email, password, full_name, role) |
| `POST` | `/api/auth/login` | Connexion, retourne access token + utilisateur |
| `POST` | `/api/auth/logout` | Déconnexion, révocation du refresh token |
| `POST` | `/api/auth/refresh` | Renouvellement silencieux de l'access token (via cookie httpOnly) |
| `GET` | `/api/auth/me` | Profil utilisateur courant depuis le token |

### Profil

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/profile` | Récupérer le profil complet |
| `PUT` | `/api/profile` | Mettre à jour le profil (full_name, role, company, phone) |

### Quiz

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/questions` | Liste des questions (ordre aléatoire) |
| `POST` | `/api/quiz-results` | Sauvegarder un résultat de quiz |
| `GET` | `/api/quiz-results` | Historique des résultats de l'utilisateur |

### Assistant

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | Envoyer un message, recevoir une réponse locale |

---

## 🐳 Docker

### Services

| Service | Image | Rôle |
| :--- | :--- | :--- |
| `db` | `postgres:15-alpine` | Base de données avec persistance et seed initial |
| `app` | Construit depuis `Dockerfile.dev` | Frontend Vite + Backend Node.js |

### Commandes

```bash
# Démarrer les services
docker-compose up

# Reconstruire l'image après modifications du code
docker-compose build app
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter et supprimer les conteneurs
docker-compose down
```

Les données PostgreSQL sont persistées dans le volume `pgdata`.

---

## 🎨 Design & Accessibilité

### Système de Design

- **Thème dynamique** : basculement mode clair / sombre avec persistance
- **Variables CSS** : tokens sémantiques pour les couleurs, espacements et typographie
- **Typographie** : Plus Jakarta Sans pour l'interface
- **Responsive** : adaptation de 320px à 1440px+, sidebar overlay mobile

### Accessibilité

- Contrastes conformes WCAG AA
- États de focus visibles pour la navigation clavier
- Labels ARIA sur les éléments interactifs
- Navigation au clavier complète

---

## 🧪 Scripts Disponibles

```bash
# Développement (frontend + backend en parallèle)
npm run dev

# Démarrage Docker
npm run start:docker

# Build de production
npm run build

# Linter
npm run lint

# Prévisualisation du build
npm run preview
```

---

## 🤝 Contribution

Les contributions sont les bienvenues :

1. Ouvrir une issue pour discuter des changements proposés
2. Créer une branche feature depuis `main`
3. Respecter les conventions de code existantes
4. Soumettre une pull request avec une description détaillée

---

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---

*Développé pour renforcer la prévention des risques professionnels en Tunisie. 🇹🇳*
