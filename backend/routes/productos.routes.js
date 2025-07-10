import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        p.id_producto,
        p.nombre,
        p.ubicacion_almacen,
        p.fkid_categoria,
        c.marca AS categoria_marca,
        p.fkid_orden_compra,
        o.precio_unitario,
        o.cantidad_compra,
        pr.nombre_empresa AS proveedor
      FROM producto p
      LEFT JOIN categoria c ON p.fkid_categoria = c.id_categoria
      LEFT JOIN orden_compra o ON p.fkid_orden_compra = o.id_orden_compra
      LEFT JOIN proveedores pr ON o.fkid_proveedores = pr.id_proveedores`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /productos - Registrar producto + orden_compra
router.post("/", async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const {
    nombre,
    ubicacion_almacen,
    fkid_categoria,
    cantidad_compra,
    precio_unitario,
    fkid_proveedores,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insertar orden de compra
    const [ordenCompraResult] = await conn.query(
      "INSERT INTO orden_compra (fecha_orden, cantidad_compra, precio_unitario, fkid_proveedores) VALUES (CURDATE(), ?, ?, ?)",
      [cantidad_compra, precio_unitario, fkid_proveedores]
    );

    const ordenId = ordenCompraResult.insertId;

    // 2. Insertar producto
    const [productoResult] = await conn.query(
      "INSERT INTO producto (nombre, ubicacion_almacen, fkid_categoria, fkid_orden_compra) VALUES (?, ?, ?, ?)",
      [nombre, ubicacion_almacen, fkid_categoria, ordenId]
    );

    await conn.commit();
    res.status(201).json({
      message: "Producto registrado exitosamente",
      productoId: productoResult.insertId,
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error al registrar producto:", error);
    res.status(500).json({ message: "Error del servidor" });
  } finally {
    conn.release();
  }
});

// DELETE /api/productos/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Obtener la orden de compra relacionada
    const [producto] = await conn.query(
      "SELECT fkid_orden_compra FROM producto WHERE id_producto = ?",
      [id]
    );

    if (producto.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const ordenId = producto[0].fkid_orden_compra;

    // 2. Eliminar producto
    await conn.query("DELETE FROM producto WHERE id_producto = ?", [id]);

    // 3. Eliminar orden de compra
    await conn.query("DELETE FROM orden_compra WHERE id_orden_compra = ?", [
      ordenId,
    ]);

    await conn.commit();
    res.json({
      message: "Producto y orden de compra eliminados correctamente",
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error del servidor" });
  } finally {
    conn.release();
  }
});

// PUT /api/productos/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    ubicacion_almacen,
    fkid_categoria,
    cantidad_compra,
    precio_unitario,
    fkid_proveedores,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Obtener id de orden_compra del producto
    const [[{ fkid_orden_compra }]] = await conn.query(
      "SELECT fkid_orden_compra FROM producto WHERE id_producto = ?",
      [id]
    );

    // Actualizar producto
    await conn.query(
      `UPDATE producto 
       SET nombre = ?, ubicacion_almacen = ?, fkid_categoria = ?
       WHERE id_producto = ?`,
      [nombre, ubicacion_almacen, fkid_categoria, id]
    );

    // Actualizar orden de compra
    await conn.query(
      `UPDATE orden_compra 
       SET cantidad_compra = ?, precio_unitario = ?, fkid_proveedores = ?
       WHERE id_orden_compra = ?`,
      [cantidad_compra, precio_unitario, fkid_proveedores, fkid_orden_compra]
    );

    await conn.commit();
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    await conn.rollback();
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error del servidor" });
  } finally {
    conn.release();
  }
});

export default router;
