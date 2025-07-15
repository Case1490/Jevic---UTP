import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useProductos } from "../../context/ProductContext";

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductos } = useProductos(); // ✅ necesario para actualizar el contexto

  const [form, setForm] = useState({
    nombre: "",
    ubicacion_almacen: "",
    categoria: "",
    stock: "",
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
      stock,
      precio_unitario,
      fkid_proveedores,
    } = form;

    if (
      !nombre.trim() ||
      !ubicacion_almacen.trim() ||
      !categoria.trim() ||
      !stock ||
      !precio_unitario ||
      !fkid_proveedores
    ) {
      alert("⚠️ Todos los campos son obligatorios.");
      return false;
    }

    if (Number(stock) <= 0 || Number(precio_unitario) <= 0) {
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
          stock: parseInt(form.stock),
          precio_unitario: parseFloat(form.precio_unitario),
          fkid_proveedores: parseInt(form.fkid_proveedores),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await fetchProductos(); // ✅ Actualiza la lista global
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

      const resProd = await fetch("http://localhost:3001/api/productos");
      const allProds = await resProd.json();
      const prod = allProds.find((p) => p.id_producto == id);

      if (prod) {
        setForm({
          nombre: prod.nombre,
          ubicacion_almacen: prod.ubicacion_almacen,
          categoria: prod.categoria_marca,
          stock: prod.stock,
          precio_unitario: prod.precio_unitario,
          fkid_proveedores: prod.fkid_proveedores || "",
        });
      }
    };
    fetchInfo();
  }, [id]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] mb-6">
          Editar Producto
        </h1>
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  min="1"
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
