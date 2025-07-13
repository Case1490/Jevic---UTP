import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// 📥 Obtener todos los proveedores
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM proveedores");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener proveedores" });
  }
});

// ➕ Registrar nuevo proveedor
router.post("/", async (req, res) => {
  const { nombre_empresa, telefono, correo } = req.body;
  if (!nombre_empresa || !telefono || !correo) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    await pool.query(
      "INSERT INTO proveedores (nombre_empresa, telefono, correo) VALUES (?, ?, ?)",
      [nombre_empresa, telefono, correo]
    );
    res.json({ message: "Proveedor registrado correctamente" });
  } catch (err) {
    console.error("Error en el backend:", err); // ⬅️ agrega esto para ver el error
    res.status(500).json({ message: "Error al registrar proveedor" });
  }
});

// ✏️ Editar proveedor
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_empresa, telefono, correo } = req.body;

  try {
    await pool.query(
      "UPDATE proveedores SET nombre_empresa = ?, telefono = ?, correo = ? WHERE id_proveedores = ?",
      [nombre_empresa, telefono, correo, id]
    );
    res.json({ message: "Proveedor actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar proveedor" });
  }
});

// ❌ Eliminar proveedor
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM proveedores WHERE id_proveedores = ?", [id]);
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar proveedor" });
  }
});

export default router;
