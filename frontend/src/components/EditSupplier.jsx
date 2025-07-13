import { useEffect, useState } from "react";

const EditSupplier = ({ supplierData, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nombre_empresa: "",
    telefono: "",
    correo: "",
  });

  useEffect(() => {
    if (supplierData) {
      setForm({
        nombre_empresa: supplierData.nombre_empresa || "",
        telefono: supplierData.telefono || "",
        correo: supplierData.correo || "",
      });
    }
  }, [supplierData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const { nombre_empresa, telefono, correo } = form;
    if (!nombre_empresa.trim() || !telefono || !correo.trim()) {
      alert("⚠️ Todos los campos son obligatorios");
      return false;
    }
    if (!/^\d+$/.test(telefono)) {
      alert("⚠️ El teléfono debe contener solo números");
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
      alert("⚠️ Correo no válido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/proveedores/${supplierData.id_proveedores}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("✅ Proveedor actualizado");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-[var(--blue-main)]">
          Editar Proveedor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSupplier;
