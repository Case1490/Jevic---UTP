import { useEffect, useState } from "react";
import { useProductos } from "../../context/ProductContext";
import Sidebar from "../../components/Sidebar";

const RegisterProduct = () => {
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const { fetchProductos } = useProductos();

  const [form, setForm] = useState({
    nombre: "",
    ubicacion_almacen: "",
    categoria: "",
    fkid_proveedores: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarCampos = () => {
    const { nombre, ubicacion_almacen, categoria, fkid_proveedores } = form;

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(nombre)) {
      alert("⚠️ El nombre solo debe contener letras, números y espacios.");
      return false;
    }

    if (
      !nombre.trim() ||
      !ubicacion_almacen.trim() ||
      !categoria.trim() ||
      !fkid_proveedores
    ) {
      alert("⚠️ Todos los campos son obligatorios.");
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
      const res = await fetch("http://localhost:3001/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          ubicacion_almacen: form.ubicacion_almacen,
          fkid_proveedores: form.fkid_proveedores,
          fkid_categoria,
          nueva_categoria,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Producto registrado");
        setForm({
          nombre: "",
          ubicacion_almacen: "",
          categoria: "",
          fkid_proveedores: "",
        });
        await fetchProductos();
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
      <Sidebar />

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
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-sm text-gray-700">
                Marca
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
