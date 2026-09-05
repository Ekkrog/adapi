import express from "express";
import { pool } from "../db.js";

export const categories = express.Router();

categories.get("/", async (req, res) => {
    try {
    const { rows } = await pool.query
    (`SELECT * FROM categorie`)
    res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "erreur lors de la récupération des categories"})
        
    }
}); 

