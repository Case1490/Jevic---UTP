import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { useEffect, useState } from "react";

const RegisterProduct = () => {
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    ubicacion_almacen: "",
    fkid_categoria: "",
    cantidad_compra: "",
    precio_unitario: "",
    fkid_proveedores: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validarCampos = () => {
    const {
      nombre,
      ubicacion_almacen,
      fkid_categoria,
      cantidad_compra,
      precio_unitario,
      fkid_proveedores,
    } = form;

    if (Number(cantidad_compra) <= 0 || Number(precio_unitario) <= 0) {
      alert("⚠️ Precio y cantidad deben ser mayores a cero.");
      return false;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(nombre)) {
      alert("⚠️ El nombre solo debe contener letras, números y espacios.");
      return false;
    }

    if (
      !nombre.trim() ||
      !ubicacion_almacen.trim() ||
      !fkid_categoria ||
      !cantidad_compra ||
      !precio_unitario ||
      !fkid_proveedores
    ) {
      alert("⚠️ Todos los campos son obligatorios.");
      return false;
    }

    if (
      isNaN(fkid_categoria) ||
      isNaN(cantidad_compra) ||
      isNaN(precio_unitario) ||
      isNaN(fkid_proveedores)
    ) {
      alert("⚠️ Categoría, Proveedor, Precio y Cantidad deben ser numéricos.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    try {
      const res = await fetch("http://localhost:3001/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Producto registrado");
        setForm({
          nombre: "",
          ubicacion_almacen: "",
          fkid_categoria: "",
          cantidad_compra: "",
          precio_unitario: "",
          fkid_proveedores: "",
        });
      } else {
        alert("⚠️ Error: " + data.message);
      }
    } catch (err) {
      alert("❌ Error de red: " + err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const resCat = await fetch(
        "http://localhost:3001/api/catalogos/categorias"
      );
      const resProv = await fetch(
        "http://localhost:3001/api/catalogos/proveedores"
      );
      setCategorias(await resCat.json());
      setProveedores(await resProv.json());
    };
    fetchData();
  }, []);

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
          <Link to="/admin/usuarios" className="flex items-center gap-2 p-2">
            <FaUsers />
            <span>Usuarios</span>
          </Link>
          <Link
            to="/admin/registrar-producto"
            className="flex items-center gap-2 bg-[var(--blue-second)] rounded-full p-2"
          >
            <FaFileInvoice />
            <span>Registrar Producto</span>
          </Link>
          <Link
            to="/admin/lista-productos"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice />
            <span>Ver Productos</span>
          </Link>
        </nav>
      </aside>

      {/* Main dashboard */}
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] mb-6">
          Registrar Producto
        </h1>
        <div className="col-span-4 bg-white p-6 rounded-2xl shadow-md max-w-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del producto
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Teclado mecánico"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ubicación en almacén
              </label>
              <input
                type="text"
                name="ubicacion_almacen"
                value={form.ubicacion_almacen}
                onChange={handleChange}
                placeholder="Ej: Estante A"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <select
                name="fkid_categoria"
                value={form.fkid_categoria}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Selecciona una categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Precio Unitario (S/)
                </label>
                <input
                  type="number"
                  name="precio_unitario"
                  value={form.precio_unitario}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="1"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad comprada
                </label>
                <input
                  type="number"
                  name="cantidad_compra"
                  value={form.cantidad_compra}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Proveedor
              </label>
              <select
                name="fkid_proveedores"
                value={form.fkid_proveedores}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Selecciona un proveedor --</option>
                {proveedores.map((prov) => (
                  <option key={prov.id_proveedores} value={prov.id_proveedores}>
                    {prov.nombre_empresa}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[var(--blue-main)] text-white font-semibold py-2 rounded-md hover:bg-[var(--blue-second)] transition"
              >
                Registrar producto
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterProduct;
