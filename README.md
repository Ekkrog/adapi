# AdAPI

API REST pour la gestion d'une recyclerie / boutique de dépôt-vente : donatrices, dépôts, objets, réparations et statistiques.

## Prérequis

- Node.js (version 18 ou supérieure recommandée)
- PostgreSQL

## Installation

```bash
git clone <url-du-dépôt>
cd adapi
npm install
```

## Variables d'environnement

Crée un fichier `.env` à la racine du projet (à adapter selon la configuration réelle de `db.js`) :

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=motdepasse
PGDATABASE=adapi
PORT=3000
```

> À vérifier / adapter selon le contenu de `db.js` : si le projet utilise une seule variable `DATABASE_URL` plutôt que des variables `PG*` séparées, remplace ce bloc en conséquence.

## Importer la base de données

Le schéma et les données de départ sont fournis dans `migration_up.sql` (création des tables et types) et `seed.sql` (données d'exemple).

```bash
psql -U postgres -d adapi -f migration_up.sql
psql -U postgres -d adapi -f seed.sql
```

Adapte `-U` et `-d` à ton utilisateur et au nom de ta base.

## Lancer le projet

```bash
npm run dev
```

> À vérifier dans `package.json` : remplace par `npm start` si c'est le nom du script configuré.

Le serveur démarre par défaut sur `http://localhost:3000`.

## Routes disponibles

| Méthode | Route | Description | Corps attendu |
|---|---|---|---|
| GET | `/personnes` | Liste toutes les personnes (donatrices) | — |
| POST | `/personnes` | Crée une personne | `{ nom, prenom, telephone?, adherente? }` |
| GET | `/depots` | Liste tous les dépôts | — |
| GET | `/depots/:id` | Un dépôt avec sa donatrice et ses objets | — |
| POST | `/depots` | Crée un dépôt | `{ personne_id, date_depot, type }` (`type` ∈ `boutique`, `domicile`) |
| POST | `/depots/:id/objets` | Ajoute un objet à un dépôt | `{ libelle, poids_kg, etat_arrivee, categorie_id }` (`etat_arrivee` ∈ `bon_etat`, `a_reparer`, `hors_service`) |
| GET | `/objets` | Liste les objets, filtrable par `?statut=` et `?categorie_id=` | — |
| GET | `/objets/:id` | Un objet avec sa catégorie, son dépôt et sa donatrice | — |
| PATCH | `/objets/:id/statut` | Met à jour le statut (et éventuellement le prix) d'un objet | `{ statut, prix? }` (`statut` ∈ `arrive`, `en_reparation`, `en_rayon`, `vendu`, `recycle`) |
| GET | `/categories` | Liste toutes les catégories | — |
| GET | `/stats` | Objets par statut, poids total reçu, poids détourné de la déchetterie | — |

Toutes les routes renvoient du JSON. Les erreurs de validation (champ manquant, valeur d'énumération invalide) renvoient un code `400` avec `{ error: "..." }`, les ressources introuvables un `404`, et les erreurs serveur un `500`.

> **À confirmer** : la route stats est déclarée `stats.get("/stats", ...)` à l'intérieur de son routeur. Vérifie la ligne `app.use(...)` dans le fichier principal — si le routeur est monté sur `/stats`, le chemin final est `/stats/stats` et non `/stats`. Corrige le tableau ci-dessus en conséquence si besoin.

## Tester l'API

Les requêtes de test sont écrites avec l'extension **REST Client** de VS Code et versionnées dans le dossier `http/` (un fichier `.http` par ressource : `personnes.http`, `depots.http`, `objets.http`, `stats.http`).

1. Installer l'extension **REST Client** (auteur Huachao Mao) dans VS Code.
2. Lancer le serveur (`npm run dev`) et t'assurer que la base est bien importée avec ses données de départ.
3. Ouvrir un fichier `.http` dans le dossier `http/` et cliquer sur `Send Request` au-dessus de chaque requête.

Chaque fichier couvre un cas de succès par route ainsi que les cas d'erreur principaux (identifiant inexistant, corps incomplet, valeur d'énumération invalide).
