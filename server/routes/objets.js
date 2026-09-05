import express from "express";
import { pool } from "../db.js";

export const objets = express.Router();

objets.get("/", async (req, res) => {
  try {
    const { statut, categorie_id } = req.query;
    const { rows } = await pool.query(
      `SELECT o.id, o.libelle, o.statut, o.prix, c.libelle AS categorie FROM objet o 
        JOIN categorie c ON c.id = o.categorie_id WHERE o.statut = COALESCE ($1::statut_objet, o.statut) AND o.categorie_id = COALESCE($2::integer, o.categorie_id) ORDER BY o.id DESC;`,
      [statut ?? null, categorie_id ?? null],
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des objets" });
  }
});

// Un objet, sa catégorie, son dépôt et le nom de sa donatrice
objets.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query(
      `SELECT  
          objet.id AS objet_id,
          objet.libelle AS objet_libelle,
          objet.poids_kg,
          objet.etat_arrivee,
          objet.statut,
          objet.prix,
          categorie.libelle AS categorie_libelle,
          depot.id AS depot_id,
          depot.date_depot,
          depot.type AS depot_type,
          personne.id AS personne_id,
          personne.nom,
          personne.prenom
          FROM objet
          JOIN depot ON objet.depot_id = depot.id
          JOIN personne ON depot.personne_id = personne.id
          JOIN categorie ON objet.categorie_id = categorie.id
          WHERE objet.id = $1;`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Objet non trouvé" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des objets" });
  }
});

objets.patch("/:id/statut", async (req, res) => {
  try {
    const id = req.params.id
    const { statut, prix } = req.body;

      if (!statut) {
      return res.status(400).json({ error: "le statut est obligatoire" });
    }

    const { rows } = await pool.query(
      `UPDATE objet
      SET statut = $1, prix = COALESCE($2, prix)
      WHERE id = $3
      RETURNING *;`,
      [statut, prix ?? null, id]
    );

     if (rows.length === 0) {
      return res.status(404).json({ error: "objet non trouvé" });
    }
  
    res.status(200).json(rows[0])
  } catch (error) {
    console.error(error);
    res.status(400).json({ error : "statut invalide" })
  }
})
