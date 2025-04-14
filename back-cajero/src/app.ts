import express from "express";
import cors from "cors";
import { AppDataSource } from "./data";
import { AppRoutes } from "./presentation";
import { envs } from "./config";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(AppRoutes.routes);
AppDataSource.initialize();

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Definir el puerto
const PORT = envs.PORT;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
