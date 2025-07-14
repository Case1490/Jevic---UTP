import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// POST /api/ventas
router.post("/", async (req, res) => {
  const { MetodoPago, Cantidad, fkid_usuario, fkid_producto } = req.body;

  try {
    // 1. Obtener el precio del producto
    const [prodResult] = await pool.query(
      "SELECT precio, stock FROM producto WHERE id_producto = ?",
      [fkid_producto]
    );

    if (prodResult.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const producto = prodResult[0];

    if (producto.stock < Cantidad) {
      return res.status(400).json({ message: "Stock insuficiente" });
    }

    const precioUnit = producto.precio;
    const subtotal = precioUnit * Cantidad;
    const igv = +(subtotal * 0.18).toFixed(2);
    const total = +(subtotal + igv).toFixed(2);

    // 2. Insertar la venta
    await pool.query(
      `INSERT INTO venta (MetodoPago, Cantidad, Igv, Total, fecha, fkid_usuario, fkid_producto)
       VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
      [MetodoPago, Cantidad, igv, total, fkid_usuario, fkid_producto]
    );

    // 3. Actualizar el stock (nombre correcto de tabla y campo)
    await pool.query(
      "UPDATE producto SET stock = stock - ? WHERE id_producto = ?",
      [Cantidad, fkid_producto]
    );

    res.status(201).json({ message: "Venta registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar venta:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
