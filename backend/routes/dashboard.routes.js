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
    const [[{ totalUsuarios }]] = await pool.query(
      "SELECT COUNT(*) AS totalUsuarios FROM usuarios WHERE activo = 1"
    );

    res.json({
      totalProductos,
      totalProveedores,
      totalUsuarios,
    });
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
      SELECT LOWER(c.marca) AS categoria, COUNT(p.id_producto) AS cantidad
      FROM categoria c
      JOIN producto p ON p.fkid_categoria = c.id_categoria
      GROUP BY LOWER(c.marca)
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener conteo de categorías:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
