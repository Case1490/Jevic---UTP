import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// GET - listar productos con información completa y actualizada
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.ubicacion_almacen,
        c.marca AS categoria_marca,
        (
          SELECT SUM(cantidad_compra)
          FROM orden_compra
          WHERE fkid_producto = p.id_producto
        ) AS stock_acumulado,
        oc.precio_unitario,
        oc.cantidad_compra,
        pr.nombre_empresa AS proveedor
      FROM producto p
      LEFT JOIN categoria c ON p.fkid_categoria = c.id_categoria
      LEFT JOIN (
        SELECT o.*
        FROM orden_compra o
        INNER JOIN (
          SELECT MAX(id_orden_compra) AS max_id
          FROM orden_compra
          WHERE fkid_producto IS NOT NULL
          GROUP BY fkid_producto
        ) ultimas ON o.id_orden_compra = ultimas.max_id
      ) oc ON oc.fkid_producto = p.id_producto
      LEFT JOIN proveedores pr ON oc.fkid_proveedores = pr.id_proveedores
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});
// POST - registrar producto con orden vacía (pero proveedor sí)
router.post("/", async (req, res) => {
  const {
    nombre,
    ubicacion_almacen,
    fkid_categoria,
    nueva_categoria,
    fkid_proveedores,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let categoriaId = fkid_categoria;
    if (!fkid_categoria && nueva_categoria?.trim()) {
      const [existe] = await conn.query(
        "SELECT id_categoria FROM categoria WHERE marca = ?",
        [nueva_categoria.trim()]
      );
      categoriaId = existe.length
        ? existe[0].id_categoria
        : (
            await conn.query("INSERT INTO categoria (marca) VALUES (?)", [
              nueva_categoria.trim(),
            ])
          )[0].insertId;
    }

    if (!categoriaId) {
      throw new Error("No se pudo determinar una categoría válida.");
    }

    const [ordenResult] = await conn.query(
      `INSERT INTO orden_compra (fecha_orden, cantidad_compra, precio_unitario, fkid_proveedores)
   VALUES (CURDATE(), 0, 0, ?)`,
      [fkid_proveedores]
    );
    const idOrden = ordenResult.insertId;

    const [productoResult] = await conn.query(
      `INSERT INTO producto (nombre, ubicacion_almacen, fkid_categoria, fkid_orden_compra)
       VALUES (?, ?, ?, ?)`,
      [nombre, ubicacion_almacen, categoriaId, idOrden]
    );

    await conn.commit();
    res.status(201).json({
      message: "✅ Producto registrado correctamente",
      productoId: productoResult.insertId,
    });
  } catch (error) {
    await conn.rollback();
    console.error("❌ Error al registrar producto:", error);
    res.status(500).json({ message: "Error del servidor: " + error.message });
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

    // 2. Eliminar el producto
    await conn.query("DELETE FROM producto WHERE id_producto = ?", [id]);

    // 3. Solo eliminar la orden si existe (por robustez futura)
    if (ordenId) {
      await conn.query("DELETE FROM orden_compra WHERE id_orden_compra = ?", [
        ordenId,
      ]);
    }

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
    nueva_categoria,
    stock,
    precio_unitario,
    fkid_proveedores,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let categoriaId = null;

    if (fkid_categoria && !isNaN(fkid_categoria)) {
      categoriaId = fkid_categoria;
    }

    if (!categoriaId && nueva_categoria?.trim()) {
      const [existe] = await conn.query(
        "SELECT id_categoria FROM categoria WHERE marca = ?",
        [nueva_categoria.trim()]
      );

      if (existe.length > 0) {
        categoriaId = existe[0].id_categoria;
      } else {
        const [result] = await conn.query(
          "INSERT INTO categoria (marca) VALUES (?)",
          [nueva_categoria.trim()]
        );
        categoriaId = result.insertId;
      }
    }

    if (!categoriaId) {
      throw new Error("No se pudo determinar una categoría válida.");
    }

    const [[{ fkid_orden_compra }]] = await conn.query(
      "SELECT fkid_orden_compra FROM producto WHERE id_producto = ?",
      [id]
    );

    await conn.query(
      `UPDATE producto 
       SET nombre = ?, ubicacion_almacen = ?, fkid_categoria = ?, stock = ?
       WHERE id_producto = ?`,
      [nombre, ubicacion_almacen, categoriaId, stock, id]
    );

    await conn.query(
      `UPDATE orden_compra 
       SET cantidad_compra = ?, precio_unitario = ?, fkid_proveedores = ?
       WHERE id_orden_compra = ?`,
      [stock, precio_unitario, fkid_proveedores, fkid_orden_compra]
    );

    await conn.commit();
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    await conn.rollback();
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  } finally {
    conn.release();
  }
});

export default router;
