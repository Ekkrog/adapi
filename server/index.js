import express from "express";
import cors from "cors";
import { categories } from "./routes/categories.js";
import { depots } from "./routes/depots.js";
import { objets } from "./routes/objets.js";
import { personnes } from "./routes/personnes.js";
import { stats } from "./routes/stats.js"

const app = express();
app.use(express.json());

const PORT = 3000;


app.use(cors());
app.use(`/categories`, categories);
app.use(`/depots`, depots);
app.use(`/objets`, objets);
app.use(`/personnes`, personnes);
app.use(`/stats`, stats);


app.listen(PORT, () => {
    console.log("🚀 Serveur lancé : http://localhost:3000");
});