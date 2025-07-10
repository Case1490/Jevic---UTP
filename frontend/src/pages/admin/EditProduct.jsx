import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";

import Swal from "sweetalert2";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    setForm({ ...form, [e.target.name]: e.target.value });
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

    if (Number(cantidad_compra) <= 0 || Number(precio_unitario) <= 0) {
      alert("⚠️ Precio y cantidad deben ser mayores a cero.");
      return false;
    }

    if (
      isNaN(fkid_categoria) ||
      isNaN(cantidad_compra) ||
      isNaN(precio_unitario) ||
      isNaN(fkid_proveedores)
    ) {
      alert("⚠️ Categoría, proveedor, precio y cantidad deben ser numéricos.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        Swal.fire(
          "Actualizado",
          "El producto fue actualizado con éxito",
          "success"
        ).then(() => {
          navigate("/admin/lista-productos");
        });
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "No se pudo actualizar", "error");
      }
    } catch (error) {
      alert("❌ Error de red: " + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const resProd = await fetch(`http://localhost:3001/api/productos`);
      const productos = await resProd.json();
      const producto = productos.find((p) => p.id_producto === parseInt(id));
      if (producto) {
        setForm({
          nombre: producto.nombre,
          ubicacion_almacen: producto.ubicacion_almacen,
          fkid_categoria: producto.fkid_categoria,
          cantidad_compra: producto.cantidad_compra,
          precio_unitario: producto.precio_unitario,
          fkid_proveedores: producto.fkid_proveedores,
        });
      }

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
  }, [id]);

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
            <FaUsers />
            <span>Usuarios</span>
          </Link>
          <Link
            to="/admin/registrar-producto"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice />
            <span>Registrar Producto</span>
          </Link>
          <Link
            to="/admin/lista-productos"
            className="flex items-center gap-2 p-2 bg-[var(--blue-second)] rounded-full"
          >
            <FaFileInvoice />
            <span>Ver Productos</span>
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] mb-6">
          Editar Producto
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
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
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
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
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
              >
                <option value="">-- Selecciona una categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria || cat.marca}
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
                  min="0"
                  value={form.precio_unitario}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad comprada
                </label>
                <input
                  type="number"
                  name="cantidad_compra"
                  min="0"
                  value={form.cantidad_compra}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
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
                Actualizar producto
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
