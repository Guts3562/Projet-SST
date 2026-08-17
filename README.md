# SST Tunisie

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)

**SST Tunisie** est une plateforme web dédiée à la sensibilisation à la **Santé et Sécurité au Travail** en Tunisie. Elle centralise les ressources réglementaires et propose des outils interactifs pour améliorer la culture de prévention auprès des professionnels, employeurs et travailleurs.

## Objectif

Fournir un point d'entrée unique vers la réglementation tunisienne en matière de SST, en combinant :

- Un **assistant conversationnel** spécialisé dans la législation tunisienne
- Un **quiz d'évaluation** interactif pour mesurer et renforcer les connaissances
- Un **catalogue des risques** professionnels avec mesures de prévention
- Une **bibliothèque de ressources** incluant contacts institutionnels et numéros d'urgence

## Fonctionnalités principales

### Assistant SST
Réponses instantanées sur le Code du Travail tunisien, les organismes (CNSS, INRSST, Inspection du Travail), les EPI et les procédures d'urgence.

### Quiz d'évaluation
31 questions couvrant la législation, les urgences, les EPI et les bonnes pratiques. Sélection aléatoire de 10 questions par session avec feedback immédiat.

### Ressources
Répertoire des normes tunisiennes (NT), documents réglementaires obligatoires, institutions de référence et numéros d'urgence nationaux.

## Architecture

L'application est composée d'un frontend React (SPA) et d'un backend Express, communiquant via une API REST. La persistance des données est assurée par PostgreSQL.

## Stack technique

| Composant | Technologie |
| :--- | :--- |
| Frontend | React 19 + Vite 8 |
| Backend | Node.js + Express |
| Base de données | PostgreSQL 15 |
| Authentification | JWT + Bcrypt |
| Conteneurisation | Docker + Docker Compose |
| Icônes | Bootstrap Icons |
