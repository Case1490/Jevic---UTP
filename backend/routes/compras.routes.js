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

// POST - registrar nueva compra para un producto existente
router.post("/", async (req, res) => {
  const { id_producto, cantidad_comprada, precio_unitario } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Verificar que el producto existe y tiene proveedor asignado
    const [[producto]] = await conn.query(
      `SELECT p.fkid_orden_compra, o.fkid_proveedores
       FROM producto p
       JOIN orden_compra o ON p.fkid_orden_compra = o.id_orden_compra
       WHERE p.id_producto = ?`,
      [id_producto]
    );

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    if (!producto.fkid_proveedores) {
      throw new Error("El producto no tiene proveedor asignado.");
    }

    // 2. Insertar nueva orden de compra asociada al producto
    const [nuevaOrden] = await conn.query(
      `INSERT INTO orden_compra 
       (fecha_orden, cantidad_compra, precio_unitario, fkid_proveedores, fkid_producto)
       VALUES (CURDATE(), ?, ?, ?, ?)`,
      [
        cantidad_comprada,
        precio_unitario,
        producto.fkid_proveedores,
        id_producto,
      ]
    );

    // 3. Actualizar el stock del producto y apuntar a la nueva orden
    await conn.query(
      `UPDATE producto 
       SET stock = stock + ?, fkid_orden_compra = ?
       WHERE id_producto = ?`,
      [cantidad_comprada, nuevaOrden.insertId, id_producto]
    );

    await conn.commit();
    res.json({ message: "✅ Compra registrada correctamente" });
  } catch (error) {
    await conn.rollback();
    console.error("❌ Error al registrar compra:", error);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  } finally {
    conn.release();
  }
});

export default router;
