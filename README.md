# SupDeVinci Travel Hub - Version Complète

Bienvenue dans **SupDeVinci Travel Hub**, une plateforme de recherche de voyages intelligente intégrant plusieurs technologies modernes. Le projet repose sur une architecture microservices conteneurisée, prête à l’emploi pour les besoins fullstack, data-driven et en temps réel.

---

## Démarrage du projet

### 1. Build & lancement

Dans un terminal de primate fonctionnel :

```bash
docker compose up --build
```

---

### 2. Seed de la base

Génèrer les données initiales :

[http://localhost:3000/seed](http://localhost:3000/seed)

---

### 3. Accès au frontend

[http://localhost:5173/](http://localhost:5173/)

---

## Stack Technique

| Composant     | Rôle                                              |
|--------------|---------------------------------------------------|
| **Hono.js**   | API backend en TypeScript                        |
| **MongoDB**   | Base de données NoSQL (offres, users, etc.)      |
| **Redis**     | Pub/Sub pour les notifications temps réel        |
| **Neo4j**     | Base de données graphe pour recommandations      |
| **Next.js**   | Frontend moderne, stylé et rapide                 |
| **Docker**    | Conteneurisation de tous les services            |
| **Docker Compose** | Orchestration locale multi-services         |

---

## 📦 Fonctionnalités principales

-  Authentification utilisateur
-  Recherche d’offres de voyage
-  Recommandations basées sur les préférences
-  Notifications en temps réel avec Redis
- 🛠 Code modulaire, extensible, et moins crado que ton bureau

---

##  Arborescence (résumée)

```
📁 mongoDbProject/
├── backend/               # API Hono.js
├── frontend/              # Next.js
├── docker-compose.yml     # Docker orchestration
└── README.md              # Toi-même tu sais
```

---

## 🧪 Tips Dev

- Reset  
  ```bash
  docker compose down -v
  ```

- Rebuild  
  ```bash
  docker compose up --build
  ```

---

## 📜 Auteur

CHAUFOURNAIS Loïc, Hugo Vaillant et Thomas DE OLIVEIRA

---
