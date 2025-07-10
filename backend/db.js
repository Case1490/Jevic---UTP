import mysql from "mysql2/promise";

// Crear el pool de conexiones
export const pool = mysql.createPool({
  host: "localhost",
  user: "root", // cámbialo si usas otro usuario
  password: "12345678", // tu contraseña, si tiene
  database: "dbtiendatec", // tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
