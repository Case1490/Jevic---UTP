import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import productosRoutes from "./routes/productos.routes.js";
import catalogosRoutes from "./routes/catalogos.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import proveedoresRoutes from "./routes/proveedores.routes.js";
import authRoutes from "./routes/auth.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Aplicación de las rutas
app.use("/api/productos", productosRoutes);
app.use("/api/catalogos", catalogosRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ventas", ventasRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor backend funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
