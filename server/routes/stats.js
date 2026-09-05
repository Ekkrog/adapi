import express from "express";
import { pool } from "../db.js";

export const stats = express.Router();

// GET /api/stats — objets par statut, poids total reçu, poids détourné de la déchetterie
router.get("/stats", async (req, res) => {
    try {
        const [parStatut, poidsTotal, poidsDetourne] = await Promise.all([
            pool.query(
                `SELECT statut, COUNT(*) AS nb_objets
                 FROM objet
                 GROUP BY statut
                 ORDER BY nb_objets DESC`
            ),
            pool.query(
                `SELECT ROUND(SUM(poids_kg), 2) AS poids_total_kg
                 FROM objet`
            ),
            pool.query(
                `SELECT ROUND(SUM(poids_kg), 2) AS poids_detourne_kg
                 FROM objet
                 WHERE statut <> 'recycle'`
            ),
        ]);

        res.json({
            objets_par_statut: parStatut.rows,
            poids_total_kg: poidsTotal.rows[0].poids_total_kg,
            poids_detourne_kg: poidsDetourne.rows[0].poids_detourne_kg,
        });
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({ error: "Erreur serveur" });
    }
});