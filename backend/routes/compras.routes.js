import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET /api/compras - historial de compras
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id_orden_compra,
        p.nombre AS producto,
        o.cantidad_compra,
        o.precio_unitario,
        pr.nombre_empresa AS proveedor,
        o.fecha_orden
      FROM orden_compra o
      JOIN producto p ON p.fkid_orden_compra = o.id_orden_compra
      JOIN proveedores pr ON pr.id_proveedores = o.fkid_proveedores
      ORDER BY o.fecha_orden DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener historial de compras:", err);
    res.status(500).json({ message: "Error al obtener historial de compras" });
  }
});

// POST /api/compras - registrar una nueva compra y actualizar stock
router.post("/", async (req, res) => {
  const { id_producto, cantidad_comprada, precio_unitario, fkid_proveedores } =
    req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Registrar en orden_compra
    const [ordenResult] = await conn.query(
      "INSERT INTO orden_compra (fecha_orden, cantidad_compra, precio_unitario, fkid_proveedores) VALUES (CURDATE(), ?, ?, ?)",
      [cantidad_comprada, precio_unitario, fkid_proveedores]
    );
    const ordenId = ordenResult.insertId;

    // 2. Actualizar producto con nueva orden y stock
    await conn.query(
      "UPDATE producto SET fkid_orden_compra = ?, stock = stock + ? WHERE id_producto = ?",
      [ordenId, cantidad_comprada, id_producto]
    );

    await conn.commit();
    res.json({ message: "Compra registrada y stock actualizado" });
  } catch (err) {
    await conn.rollback();
    console.error("Error al registrar compra:", err);
    res.status(500).json({ message: "Error del servidor" });
  } finally {
    conn.release();
  }
});

export default router;
