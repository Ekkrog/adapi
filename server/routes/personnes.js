import express from "express";
import { pool } from "../db.js";

export const personnes = express.Router();

personnes.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM personne`);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "erreur lors de la récupération des personnes" });
  }
});


// POST /api/personnes	Crée une donatrice (nom, prenom, telephone?, adherente?)
personnes.post("/", async (req, res) => {
      try {
      const { nom, prenom, telephone, adherente } = req.body;

      if (!nom || !prenom) {
            return res.status(400).json({ error: "nom et prénom obligatoire"})
      }
      
      const { rows } = await pool.query(
            `INSERT INTO personne (nom, prenom, telephone, adherente)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`,
            [nom, prenom, telephone ?? null, adherente ?? false]
      )
      res.status(201).json(rows[0])
} catch (error) {
      console.error(error);
      res.status(400).json({ error : "erreur lors de la création de la personne" })
}
});