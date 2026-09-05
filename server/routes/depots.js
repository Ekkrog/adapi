import express from "express";
import { pool } from "../db.js";

export const depots = express.Router();

depots.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * from depot`);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "erreur lors de la récupération des dépôts" });
  }
});

// Un dépôt, sa donatrice, et la liste des objets qu’il contient
depots.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query(
      `SELECT depot.id, depot.date_depot, personne.nom AS nom, personne.prenom AS prenom, objet.libelle FROM depot 
      JOIN personne ON depot.personne_id = personne.id
      JOIN objet ON objet.depot_id = depot.id
      WHERE depot.id = $1;`,
      [id],
    );

    if (rows.length === 0) {
        return res.status(404).json({ error: "depot inexistant" });
      }

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "erreur lors de la récupération du depot" });
  }
});

depots.post("/", async (req, res) => {
  try {
    const { personne_id, date_depot, type } = req.body;

    if (!date_depot) {
      return res.status(400).json({ error : "date de dépôt obligatoire" })
    }

    const { rows } = await pool.query(
      `INSERT INTO depot (personne_id, date_depot, type)
      VALUES ($1, $2, $3)
      RETURNING *;`, 
      [ personne_id, date_depot, type]
    )
    res.status(201).json(rows[0])
  } catch (error) {
    console.error(error);
    res.status(400).json({ error : "erreur lors de la création du dépôt"})
  }
});

depots.post("/:id/objets", async (req, res) => {
  try {
    const { libelle, poids_kg, etat_arrivee, categorie_id } = req.body;

    if (!libelle || !poids_kg || !etat_arrivee || !categorie_id) {
      return res.status(400).json({ error: "libelle, poids_kg, etat_arrivee et categorie_id sont obligatoires" });
    }

    const { rows } = await pool.query(
      `INSERT INTO objet (depot_id, libelle, poids_kg, etat_arrivee, categorie_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`, [ depot_id, libelle, poids_kg, etat_arrivee, categorie_id]
    )
    res.status(201).json(rows[0])
    } catch (error) {
      console.error(error);
      res.status(400).json({ error : "erreur lors de la création de l'objet" })
}
});
