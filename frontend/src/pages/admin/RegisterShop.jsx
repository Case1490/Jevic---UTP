import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const RegisterShop = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    id_producto: "",
    cantidad_comprada: "",
    precio_unitario: "",
    fkid_proveedores: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const resProd = await fetch("http://localhost:3001/api/productos");
      const resProv = await fetch(
        "http://localhost:3001/api/catalogos/proveedores"
      );
      setProductos(await resProd.json());
      setProveedores(await resProv.json());
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Compra registrada y stock actualizado");
        setForm({
          id_producto: "",
          cantidad_comprada: "",
          precio_unitario: "",
          fkid_proveedores: "",
        });
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-6 my-10 max-w-xl mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Registrar Nueva Compra</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <select
            name="id_producto"
            value={form.id_producto}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Selecciona un producto --</option>
            {productos.map((p) => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="cantidad_comprada"
            value={form.cantidad_comprada}
            onChange={handleChange}
            placeholder="Cantidad"
            className="w-full p-2 border rounded"
            min={1}
            required
          />

          <input
            type="number"
            name="precio_unitario"
            value={form.precio_unitario}
            onChange={handleChange}
            placeholder="Precio Unitario"
            className="w-full p-2 border rounded"
            min={0.1}
            step="any"
            required
          />

          <select
            name="fkid_proveedores"
            value={form.fkid_proveedores}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Selecciona un proveedor --</option>
            {proveedores.map((prov) => (
              <option key={prov.id_proveedores} value={prov.id_proveedores}>
                {prov.nombre_empresa}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Registrar Compra
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterShop;
