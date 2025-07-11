import { useEffect, useState } from "react";
import { FaFileInvoice, FaUsers, FaBoxes, FaTags } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

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
      {/* Sidebar */}
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
          <Link to="/admin/usuarios" className="flex items-center gap-2 p-2">
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
            className="flex items-center gap-2 p-2 bg-[var(--blue-second)] rounded-full"
          >
            <FaFileInvoice />
            <span>Registrar Compra</span>
          </Link>
        </nav>
      </aside>
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
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
