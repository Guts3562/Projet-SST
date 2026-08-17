# SST Tunisie — Plateforme de Sensibilisation à la Santé et Sécurité au Travail

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)

**SST Tunisie** est une plateforme web full-stack dédiée à la sensibilisation à la **Santé et Sécurité au Travail** en Tunisie. Elle centralise les ressources réglementaires et propose des outils interactifs pour améliorer la culture de prévention auprès des professionnels, employeurs et travailleurs.

---

## Contexte

La SST en Tunisie s'appuie sur un cadre réglementaire structuré — **Loi n°66-27** du 30 avril 1966, décrets d'application, normes tunisiennes (NT) — et des organismes tels que la CNSS et l'INRSST. Malgré ce dispositif, l'accès à l'information reste dispersé et les outils de formation interactifs sont rares.

Cette plateforme a été conçue pour répondre à ce manque en offrant un **point d'entrée unique** vers la réglementation, les contacts institutionnels, les numéros d'urgence, ainsi que des outils d'auto-évaluation et un assistant conversationnel spécialisé.

---

## Fonctionnalités

### Assistant Conversationnel SST

Un assistant intégré capable de répondre aux questions courantes sur le Code du Travail tunisien, les organismes institutionnels (CNSS, INRSST, Inspection du Travail), les EPI et normes NT associées, ainsi que les procédures d'urgence et contacts nationaux.

### Quiz d'Évaluation

Un système d'évaluation dynamique avec sélection aléatoire de 10 questions par session, feedback immédiat après chaque réponse, et sauvegarde des résultats pour les utilisateurs authentifiés.

### Catalogue des Risques Professionnels

Un répertoire interactif des situations à risque spécifiques à la Tunisie, organisé par secteur d'activité (BTP, agriculture, industrie) avec les dangers détaillés et mesures de prévention associées.

### Ressources & Contacts

Répertoire structuré incluant les normes tunisiennes applicables aux EPI, les documents réglementaires obligatoires, le répertoire des institutions et les numéros d'urgence nationaux.

### Guide Pratique de Prévention

Un guide étape par étape couvrant les bonnes pratiques de prévention, de l'identification des risques à la mise en conformité.

---

## Architecture

La plateforme suit une architecture **frontend / backend / base de données** :

- **Frontend** — SPA React avec navigation par sidebar responsive, thème clair/sombre dynamique et gestion d'état via Context API.
- **Backend** — API REST Express avec authentification JWT (access token + refresh token httpOnly).
- **Base de données** — PostgreSQL avec schéma relationnel pour les utilisateurs, quiz et sessions.
- **Conteneurisation** — Docker Compose pour l'orchestration de l'environnement.

---

## Stack Technologique

| Couche | Technologie | Usage |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 8 | Interface SPA réactive |
| **Backend** | Node.js + Express | API REST et authentification |
| **Base de données** | PostgreSQL 15 | Stockage persistant |
| **Styling** | CSS natif + variables CSS | Thème dynamique clair/sombre |
| **Icônes** | Bootstrap Icons | Bibliothèque d'icônes |
| **Conteneurisation** | Docker + Docker Compose | Environnement reproductible |
| **Authentification** | JWT + Bcrypt | Sécurité des sessions |

---

## Design & Accessibilité

- **Thème dynamique** : basculement mode clair / sombre avec persistance, transitions fluides sur toutes les surfaces
- **Variables CSS sémantiques** : palette de tokens pour couleurs, espacements et typographie
- **Typographie** : Plus Jakarta Sans (interface) et Fraunces (titres)
- **Responsive** : adaptation de 320px à 1440px+, sidebar overlay sur mobile
- **Accessibilité** : contrastes conformes WCAG AA, états de focus visibles, labels ARIA et navigation clavier complète

---

*Projet développé dans le cadre du module Sécurité et Santé au Travail — 1ère année. 🇹🇳*
