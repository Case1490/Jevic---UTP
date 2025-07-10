import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import productosRoutes from "./routes/productos.routes.js";
import catalogosRoutes from "./routes/catalogos.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Usar la ruta de productos
app.use("/api/productos", productosRoutes);
app.use("/api/catalogos", catalogosRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor backend funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
