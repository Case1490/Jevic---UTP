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

// POST /productos - Registrar producto + orden_compra + posible nueva categoría
router.post("/", async (req, res) => {
  const { nombre, ubicacion_almacen, fkid_categoria, nueva_categoria } =
    req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let categoriaId = null;

    if (fkid_categoria && !isNaN(fkid_categoria)) {
      categoriaId = fkid_categoria;
    }

    if (!categoriaId && nueva_categoria && nueva_categoria.trim() !== "") {
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

    // Registrar producto sin orden de compra
    const [productoResult] = await conn.query(
      "INSERT INTO producto (nombre, ubicacion_almacen, fkid_categoria) VALUES (?, ?, ?)",
      [nombre, ubicacion_almacen, categoriaId]
    );

    await conn.commit();
    res.status(201).json({
      message: "Producto registrado exitosamente",
      productoId: productoResult.insertId,
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error al registrar producto:", error);
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
    nueva_categoria,
    cantidad_compra,
    precio_unitario,
    fkid_proveedores,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let categoriaId = null;

    // Si viene una categoría existente (id)
    if (fkid_categoria && !isNaN(fkid_categoria)) {
      categoriaId = fkid_categoria;
    }

    // Si viene una nueva categoría por texto
    if (!categoriaId && nueva_categoria && nueva_categoria.trim() !== "") {
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

    // Validar que sí hay categoría
    if (!categoriaId) {
      throw new Error("No se pudo determinar una categoría válida.");
    }

    // Obtener id de orden_compra relacionado
    const [[{ fkid_orden_compra }]] = await conn.query(
      "SELECT fkid_orden_compra FROM producto WHERE id_producto = ?",
      [id]
    );

    // Actualizar producto
    await conn.query(
      `UPDATE producto 
       SET nombre = ?, ubicacion_almacen = ?, fkid_categoria = ?
       WHERE id_producto = ?`,
      [nombre, ubicacion_almacen, categoriaId, id]
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
    res.status(500).json({ message: "Error del servidor: " + error.message });
  } finally {
    conn.release();
  }
});

export default router;
