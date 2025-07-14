import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id_usuarios, nombre_usu, rol FROM usuarios WHERE correo = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];
    res.json({
      id: user.id_usuarios,
      name: user.nombre_usu,
      role: user.rol,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
