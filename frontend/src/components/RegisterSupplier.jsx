import { useState } from "react";

const RegisterSupplier = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nombre_empresa: "",
    telefono: "",
    correo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    if (!form.nombre_empresa.trim() || !form.telefono || !form.correo.trim()) {
      alert("⚠️ Todos los campos son obligatorios");
      return false;
    }

    if (!/^\d+$/.test(form.telefono)) {
      alert("⚠️ El teléfono debe contener solo números");
      return false;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.correo)) {
      alert("⚠️ Correo no válido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      console.log("Enviando:", form);
      const res = await fetch("http://localhost:3001/api/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Proveedor registrado");
        setForm({ nombre_empresa: "", telefono: "", correo: "" });
        if (onSuccess) onSuccess();
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--blue-main)] mb-4">
        Registrar nuevo proveedor
      </h2>
      <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre_empresa"
          value={form.nombre_empresa}
          onChange={handleChange}
          placeholder="Nombre de la empresa"
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="p-2 border rounded w-full"
        />
        <input
          type="email"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo"
          className="p-2 border rounded w-full"
        />
        <button
          type="submit"
          className="w-full bg-[var(--blue-main)] text-white py-2 rounded hover:bg-[var(--blue-second)]"
        >
          Registrar Proveedor
        </button>
      </form>
    </div>
  );
};

export default RegisterSupplier;
