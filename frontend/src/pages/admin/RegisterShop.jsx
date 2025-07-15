import { useEffect, useState } from "react";
import { useProductos } from "../../context/ProductContext";
import Sidebar from "../../components/Sidebar";

const RegisterShop = () => {
  const [productos, setProductos] = useState([]);
  const { fetchProductos } = useProductos();
  const [form, setForm] = useState({
    id_producto: "",
    cantidad_comprada: "",
    precio_unitario: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const resProd = await fetch("http://localhost:3001/api/productos");
      setProductos(await resProd.json());
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarCampos = () => {
    const { id_producto, cantidad_comprada, precio_unitario } = form;

    if (!id_producto || !cantidad_comprada || !precio_unitario) {
      alert("⚠️ Todos los campos son obligatorios.");
      return false;
    }

    if (parseInt(cantidad_comprada) <= 0 || parseFloat(precio_unitario) <= 0) {
      alert("⚠️ Cantidad y precio deben ser mayores a cero.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    try {
      const res = await fetch("http://localhost:3001/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_producto: parseInt(form.id_producto),
          cantidad_comprada: parseInt(form.cantidad_comprada),
          precio_unitario: parseFloat(form.precio_unitario),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Compra registrada y stock actualizado");
        setForm({
          id_producto: "",
          cantidad_comprada: "",
          precio_unitario: "",
        });
        await fetchProductos();
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      alert("❌ Error de red: " + err.message);
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
