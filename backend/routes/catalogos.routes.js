import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /categorias
router.get("/categorias", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_categoria, marca AS nombre_categoria FROM categoria"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/catalogos/proveedores
router.get("/proveedores", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_proveedores, nombre_empresa FROM proveedores"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
