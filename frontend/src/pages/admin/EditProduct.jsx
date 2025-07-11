import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    ubicacion_almacen: "",
    categoria: "",
    cantidad_compra: "",
    precio_unitario: "",
    fkid_proveedores: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

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
      categoria,
      cantidad_compra,
      precio_unitario,
      fkid_proveedores,
    } = form;

    if (
      !nombre.trim() ||
      !ubicacion_almacen.trim() ||
      !categoria.trim() ||
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

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const catExistente = categorias.find((cat) => cat.marca === form.categoria);
    const fkid_categoria = catExistente ? catExistente.id_categoria : null;
    const nueva_categoria = catExistente ? "" : form.categoria;

    try {
      const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          ubicacion_almacen: form.ubicacion_almacen,
          fkid_categoria,
          nueva_categoria,
          cantidad_compra: form.cantidad_compra,
          precio_unitario: form.precio_unitario,
          fkid_proveedores: form.fkid_proveedores,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Producto actualizado correctamente");
        navigate("/admin/lista-productos");
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      alert("❌ Error de red: " + err.message);
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const resCat = await fetch(
        "http://localhost:3001/api/catalogos/categorias"
      );
      const resProv = await fetch(
        "http://localhost:3001/api/catalogos/proveedores"
      );
      setCategorias(await resCat.json());
      setProveedores(await resProv.json());

      const resProd = await fetch(`http://localhost:3001/api/productos`);
      const allProds = await resProd.json();
      const prod = allProds.find((p) => p.id_producto == id);

      if (prod) {
        setForm({
          nombre: prod.nombre,
          ubicacion_almacen: prod.ubicacion_almacen,
          categoria: prod.categoria_marca,
          cantidad_compra: prod.cantidad_compra,
          precio_unitario: prod.precio_unitario,
          fkid_proveedores: prod.proveedor_id || "",
        });
      }
    };
    fetchInfo();
  }, [id]);

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
                className="w-full border rounded px-3 py-2"
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
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <input
                list="categorias"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <datalist id="categorias">
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.marca} />
                ))}
              </datalist>
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
                  className="w-full border rounded px-3 py-2"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad Comprada
                </label>
                <input
                  type="number"
                  name="cantidad_compra"
                  value={form.cantidad_compra}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  min="1"
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
                className="w-full border rounded px-3 py-2"
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
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarProducto;
