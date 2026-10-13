# Mon Blog

Un blog simple et complet construit avec **Node.js**, **Express**, **EJS** et **MongoDB (Mongoose)**.
Authentification par session, création/édition/suppression d'articles avec image à la une.

## Fonctionnalités

- 🔐 **Authentification** : inscription, connexion, déconnexion (mots de passe hachés avec bcrypt)
- 📝 **CRUD articles** : créer, lire, modifier, supprimer un article
- 🖼️ **Upload d'image** à la une de chaque article
- ✅ **Validation** côté serveur (titre et contenu obligatoires)
- 🧩 **Vues EJS** avec layouts (header / navbar / footer)
- 🌱 **Script de seed** pour peupler la base avec des données de démonstration

## Stack technique

| Technologie | Rôle |
|---|---|
| Node.js + Express | Serveur HTTP et routage |
| MongoDB + Mongoose | Base de données et modélisation |
| EJS | Moteur de templates |
| express-session + connect-flash | Sessions et messages flash |
| bcryptjs | Hachage des mots de passe |
| express-fileupload | Upload des images |

## Prérequis

- [Node.js](https://nodejs.org/) 18 ou plus récent
- [MongoDB](https://www.mongodb.com/try/download/community) installé et démarré

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Eaumelette/monblog.git
cd monblog

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
```

Éditez ensuite le fichier `.env` :

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/newBlog
SESSION_SECRET=change-moi-par-une-chaine-secrete
```

> Sur Windows, si MongoDB est installé comme service, démarrez-le avec
> `Start-Service MongoDB` (PowerShell en administrateur).

## Lancer le projet

```bash
# (optionnel) Peupler la base avec des données de démo
npm run seed

# Démarrer le serveur
npm start
```

Le site est alors accessible sur **http://localhost:3000**.

En développement, avec rechargement automatique :

```bash
npm run dev
```

## Comptes de démonstration

Après `npm run seed` :

- **Utilisateur** : `valentin`
- **Mot de passe** : `MotDePasse123`

## Routes principales

| Méthode | URL | Description |
|---|---|---|
| `GET` | `/` | Liste des articles |
| `GET` | `/post/:id` | Détail d'un article |
| `GET` | `/posts/new` | Formulaire de création (auth) |
| `POST` | `/posts/store` | Enregistrer un article (auth) |
| `GET` | `/posts/:id/edit` | Formulaire d'édition (auth) |
| `POST` | `/posts/:id/edit` | Mettre à jour un article (auth) |
| `POST` | `/posts/:id/delete` | Supprimer un article (auth) |
| `GET` | `/auth/register` | Formulaire d'inscription |
| `POST` | `/users/register` | Créer un compte |
| `GET` | `/auth/login` | Formulaire de connexion |
| `POST` | `/users/login` | Se connecter |
| `GET` | `/auth/logout` | Se déconnecter |
| `GET` | `/about` · `/contact` | Pages statiques |

## Structure du projet

```
blog/
├── bin/www               # Point d'entrée du serveur
├── app.js                # Configuration Express et routes
├── seed.js               # Script de peuplement de la base
├── controllers/          # Logique des routes
├── middleware/           # Auth, validation, redirection
├── models/               # Schémas Mongoose (User, BlogPost)
├── views/                # Templates EJS
│   └── layouts/          # Header, navbar, footer, scripts
└── public/               # Fichiers statiques (CSS, JS, images)
```

## Sécurité

- Les mots de passe ne sont jamais stockés en clair (hachage bcrypt, 10 rounds).
- Le fichier `.env` (secrets, chaîne de session) est exclu via `.gitignore`.
- Les routes de création/édition/suppression sont protégées par `authMiddleware`.

## Licence

Projet personnel à but pédagogique.
