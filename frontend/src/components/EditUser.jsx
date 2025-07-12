import { useEffect, useState } from "react";

const EditUser = ({ userData, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nombre_usu: "",
    apellido_usu: "",
    correo: "",
    genero: "",
    num_doc: "",
    password: "",
    rol: "",
  });

  useEffect(() => {
    if (userData) {
      setForm({
        nombre_usu: userData.nombre_usu || "",
        apellido_usu: userData.apellido_usu || "",
        correo: userData.correo || "",
        genero: userData.genero || "",
        num_doc: userData.num_doc || "",
        password: "", // no se precarga la contraseña
        rol: userData.rol || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const { nombre_usu, apellido_usu, correo, genero, num_doc, rol } = form;

    if (
      !nombre_usu.trim() ||
      !apellido_usu.trim() ||
      !correo.trim() ||
      !genero ||
      !num_doc ||
      !rol
    ) {
      alert("⚠️ Todos los campos son obligatorios");
      return false;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(correo)) {
      alert("⚠️ Ingresa un correo válido");
      return false;
    }

    if (!/^[0-9]+$/.test(num_doc)) {
      alert("⚠️ El número de documento solo debe contener dígitos");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/usuarios/${userData.id_usuarios}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("✅ Usuario actualizado");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-[var(--blue-main)]">
          Editar Usuario
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="nombre_usu"
              value={form.nombre_usu}
              onChange={handleChange}
              placeholder="Nombres"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              name="apellido_usu"
              value={form.apellido_usu}
              onChange={handleChange}
              placeholder="Apellidos"
              className="p-2 border rounded w-full"
            />
          </div>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="Correo"
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="num_doc"
            value={form.num_doc}
            onChange={handleChange}
            placeholder="Número de documento"
            className="p-2 border rounded w-full"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nueva contraseña (opcional)"
            className="p-2 border rounded w-full"
          />
          <select
            name="genero"
            value={form.genero}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          >
            <option value="">-- Género --</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          >
            <option value="">-- Rol --</option>
            <option value="admin">Administrador</option>
            <option value="normal">Personal</option>
          </select>
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

export default EditUser;
