// routes/dashboard.routes.js
import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/resumen", async (req, res) => {
  try {
    const [[{ totalProductos }]] = await pool.query(
      "SELECT COUNT(*) AS totalProductos FROM producto"
    );
    const [[{ totalProveedores }]] = await pool.query(
      "SELECT COUNT(*) AS totalProveedores FROM proveedores"
    );
    const [[{ totalCategorias }]] = await pool.query(
      "SELECT COUNT(*) AS totalCategorias FROM categoria"
    );

    res.json({ totalProductos, totalProveedores, totalCategorias });
  } catch (error) {
    console.error("Error al obtener resumen:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/dashboard/stock-bajo
router.get("/stock-bajo", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         p.nombre,
         o.cantidad_compra
       FROM producto p
       JOIN orden_compra o ON p.fkid_orden_compra = o.id_orden_compra
       WHERE o.cantidad_compra <= 5`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos con stock bajo:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/dashboard/categorias-count
router.get("/categorias-count", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.marca AS categoria, COUNT(p.id_producto) AS cantidad
      FROM producto p
      JOIN categoria c ON p.fkid_categoria = c.id_categoria
      GROUP BY c.marca
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener resumen por categoría:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
