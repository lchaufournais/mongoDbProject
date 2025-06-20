# 🧳 SupDeVinci Travel Hub - Version Complète

Bienvenue dans **SupDeVinci Travel Hub**, une plateforme de recherche de voyages intelligente intégrant plusieurs technologies modernes. Le projet repose sur une architecture microservices conteneurisée, prête à l’emploi pour les besoins fullstack, data-driven et en temps réel. T’as plus qu’à run, pas réfléchir.

---

## 🚀 Démarrage du projet

### 1. Build & lancement

Dans un terminal de primate fonctionnel :

```bash
docker compose up --build
```

Attends que ça mouline, et ne pleure pas s’il y a des logs moches, c’est normal.

---

### 2. Seed de la base

Génère les données initiales :

👉 [http://localhost:3000/seed](http://localhost:3000/seed)

Sans ça, ton site est vide comme ta boîte mail le dimanche.

---

### 3. Accès au frontend

Va sur :

👉 [http://localhost:5173/](http://localhost:5173/)

Et admire le résultat comme si t’avais codé ça sobre.

---

## 🧠 Stack Technique

| Composant          | Rôle                                        |
| ------------------ | ------------------------------------------- |
| **Hono.js**        | API backend en TypeScript                   |
| **MongoDB**        | Base de données NoSQL (offres, users, etc.) |
| **Redis**          | Pub/Sub pour les notifications temps réel   |
| **Neo4j**          | Base de données graphe pour recommandations |
| **Next.js**        | Frontend moderne, stylé et rapide           |
| **Docker**         | Conteneurisation de tous les services       |
| **Docker Compose** | Orchestration locale multi-services         |

---

## 📦 Fonctionnalités principales

- 🔐 Authentification utilisateur
- 🔍 Recherche d’offres de voyage
- 🧭 Recommandations basées sur les préférences
- 📨 Notifications en temps réel avec Redis
- 🛠️ Code modulaire, extensible, et moins crado que ton bureau

---

## REDIS

Pour SUBSCRIBE et avoir un systeme de notification en temps réel

```js
docker exec -it supdevinci-travel-hub-complete5-redis-1 redis-cli
SUBSCRIBE offers:new
```

## 📂 Arborescence (résumée)

```
📁 travel-hub/
├── backend/               # API Hono.js
├── frontend/              # Next.js
├── docker-compose.yml     # Docker orchestration
├── seed/                  # Scripts de seeding
└── README.md              # Toi-même tu sais
```

---

## 🧪 Tips Dev

- Tu veux reset tout ?

  ```bash
  docker compose down -v
  ```

- Tu veux rebuild après une modif ?

  ```bash
  docker compose up --build
  ```

- Tu veux tester sans Docker ? T’es un lâche, mais possible.

---

## 📜 Auteur

> Équipe SupDeVinci Travel Hub — avec une dose de sueur, de caffeine, et d'insultes bienveillantes.

---

Maintenant dégage et va faire tes tests, limace de compétition.
