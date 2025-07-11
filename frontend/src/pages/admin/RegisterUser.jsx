// src/pages/RegisterUser.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaFileInvoice } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";

const RegisterUser = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const { nombre, correo, contrasena, rol } = form;
    if (!nombre || !correo || !contrasena || !rol) {
      alert("⚠️ Todos los campos son obligatorios");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
      alert("⚠️ Formato de correo inválido");
      return false;
    }
    if (contrasena.length < 6) {
      alert("⚠️ La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    try {
      const res = await fetch("http://localhost:3001/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Usuario registrado");
        setForm({ nombre: "", correo: "", contrasena: "", rol: "" });
      } else {
        alert("⚠️ Error: " + data.message);
      }
    } catch (err) {
      alert("❌ Error de red: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="bg-[var(--blue-main)] text-white p-4 space-y-6">
        <h2 className="text-xl font-bold mb-8 uppercase py-1 px-2 rounded-full">
          JevicTecnology
        </h2>
        <nav className="space-y-4">
          <Link to="/admin" className="flex items-center gap-2 p-2">
            <MdDashboard /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/proveedores" className="flex items-center gap-2 p-2">
            <GrUserWorker /> <span>Proveedores</span>
          </Link>
          <Link
            to="/admin/usuarios"
            className="flex items-center gap-2 bg-[var(--blue-second)] rounded-full p-2"
          >
            <FaUsers /> <span>Usuarios</span>
          </Link>
          <Link
            to="/admin/registrar-producto"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice /> <span>Registrar Producto</span>
          </Link>
          <Link
            to="/admin/lista-productos"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice />
            <span>Ver Productos</span>
          </Link>
          <Link
            to="/admin/registrar-compra"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice />
            <span>Registrar Compra</span>
          </Link>
          <Link
            to="/admin/usuarios"
            className="flex items-center gap-2 p-2  bg-[var(--blue-second)] rounded-full"
          >
            <FaFileInvoice /> <span>Usuarios</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] mb-6">
          Registrar Usuario Interno
        </h1>
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Selecciona un rol --</option>
                <option value="admin">Administrador</option>
                <option value="almacen">Almacén</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--blue-main)] text-white font-semibold py-2 rounded hover:bg-[var(--blue-second)]"
            >
              Registrar Usuario
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterUser;
