import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE activo = true"
    );
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: err.message });
  }
});

// Registrar nuevo usuario
router.post("/", async (req, res) => {
  const { nombre_usu, apellido_usu, correo, password, rol, genero, num_doc } =
    req.body;

  if (!nombre_usu || !apellido_usu || !correo || !password || !rol) {
    return res
      .status(400)
      .json({ message: "Todos los campos obligatorios deben estar completos" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre_usu, apellido_usu, correo, password, rol, genero, num_doc)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre_usu, apellido_usu, correo, password, rol, genero, num_doc]
    );
    res
      .status(201)
      .json({ message: "Usuario registrado", id: result.insertId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: err.message });
  }
});

// PUT /api/usuarios/:id - Actualizar usuario
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_usu, apellido_usu, correo, genero, num_doc, password, rol } =
    req.body;

  try {
    const [result] = await pool.query(
      `UPDATE usuarios 
       SET nombre_usu = ?, apellido_usu = ?, correo = ?, genero = ?, num_doc = ?, password = ?, rol = ?
       WHERE id_usuarios = ?`,
      [nombre_usu, apellido_usu, correo, genero, num_doc, password, rol, id]
    );

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Eliminar usuario (soft delete)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE usuarios SET activo = false WHERE id_usuarios = ?",
      [id]
    );
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar usuario", error: err.message });
  }
});

export default router;
