import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

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
