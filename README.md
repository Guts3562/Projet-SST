# 🛡️ SST Tunisie — Santé et Sécurité au Travail

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Managed-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**SST Tunisie** est une plateforme web moderne dédiée à la sensibilisation, l'éducation et la gestion de la **Santé et Sécurité au Travail** en Tunisie. Conçue pour les professionnels, les employeurs et les travailleurs, elle centralise les ressources réglementaires et propose des outils interactifs pour améliorer la culture de la sécurité en entreprise.

---

## ✨ Caractéristiques Principales

### 🤖 SST-GPT : L'Assistant Virtuel
Un chatbot intelligent spécialisé dans la législation tunisienne (Code du Travail, décrets CNSS) et les normes de sécurité (EPI, secourisme).
- Réponses instantanées sur les obligations légales.
- Guide interactif pour le choix des équipements de protection.
- Accessible 24h/24 pour une assistance rapide.

### 📝 Évaluation Interactive (Quiz)
Testez vos connaissances à travers des sessions de quiz dynamiques.
- **Banque Aléatoire** : Questions tirées parmi plus de 30 thématiques.
- **Feedback Immédiat** : Explications détaillées pour chaque réponse.
- **Suivi des Performances** : Analyse des résultats par catégorie (Législation, Urgences, EPI).

### 🛡️ Bibliothèque de Ressources
Un accès centralisé aux informations critiques :
- **Normes Tunisiennes (NT)** : Référentiel complet des EPI obligatoires par secteur.
- **Documents Obligatoires** : Liste de contrôle pour le DUER, registres de sécurité, etc.
- **Répertoire Institutionnel** : Contacts directs avec l'INRSST, la CNSS, et l'Inspection du Travail.

### 🚨 Module d'Urgence
Accès rapide aux numéros d'urgence vitaux en Tunisie (SAMU, Protection Civile, Centre Anti-Poison) avec une interface optimisée pour le mobile.

---

## 🛠️ Stack Technique

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Interface utilisateur réactive et ultra-rapide. |
| **Backend** | Node.js + Express | API REST robuste pour la gestion des données. |
| **Base de Données** | PostgreSQL | Stockage sécurisé des profils et des scores. |
| **Styling** | Vanilla CSS | Design "Premium" personnalisé sans frameworks lourds. |
| **Auth** | JWT + Bcrypt | Authentification sécurisée des utilisateurs. |

---

## 📂 Structure du Projet

```text
Projet-Aya-Louay/
├── src/                # Code source Frontend (React)
│   ├── components/     # Composants UI (Chatbot, Quiz, Dashboard...)
│   ├── assets/         # Images et ressources statiques
│   └── lib/            # Configuration API et utilitaires
├── server/             # Backend (Node.js/Express)
│   ├── db.js           # Connexion PostgreSQL
│   └── index.js        # Points de terminaison API
├── public/             # Fichiers publics
└── package.json        # Dépendances et scripts
```

---

## 🚀 Installation et Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+)
- [PostgreSQL](https://www.postgresql.org/) installé et configuré

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/projet-sst-tunisie.git
cd projet-sst-tunisie
```

### 2. Configuration du Backend
```bash
cd server
npm install
```
Créez un fichier `.env` dans le dossier `server/` :
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/sst_db
JWT_SECRET=votre_secret_super_secure
```

### 3. Configuration du Frontend
```bash
cd ..
npm install
```

### 4. Lancer l'application
```bash
npm run dev
```
L'application lancera simultanément :
- **Frontend (Vite)** : `http://localhost:5173`
- **Backend (Node.js)** : `http://localhost:5000`
- **n8n (Orchestrateur IA)** : `http://localhost:5678`

### ⚙️ Configuration du Webhook IA
Pour que le chatbot fonctionne, vous devez configurer l'URL n8n dans `server/.env` :
- **Mode Test (Local)** : `http://localhost:5678/webhook-test/sst-chatbot` (utilisez ceci lors du développement du workflow).
- **Mode Production** : `http://localhost:5678/webhook/sst-chatbot` (activez d'abord le workflow dans n8n).
- **Mode Cloud** : Utilisez l'URL fournie par votre instance n8n.cloud.

---

## 🎨 Design & Expérience Utilisateur
Le projet utilise une esthétique **Premium Modern** :
- **Mode Sombre/Clair** : Adapté au confort visuel.
- **Responsive Design** : Expérience fluide sur desktop, tablette et mobile.
- **Micro-animations** : Transitions douces et retours interactifs.

---

## 🤝 Contribution
Les contributions sont les bienvenues ! Pour des changements majeurs, veuillez d'abord ouvrir une discussion pour discuter de ce que vous aimeriez changer.

## 📄 Licence
Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---
*Développé avec passion pour la sécurité de tous. 🇹🇳*
