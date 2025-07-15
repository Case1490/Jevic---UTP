import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useUser } from "../../context/UserContext";
import { useProductos } from "../../context/ProductContext";

const RegisterSale = () => {
  const { user } = useUser();
  const { productos, fetchProductos } = useProductos(); // Correcto

  const [form, setForm] = useState({
    fkid_producto: "",
    Cantidad: "",
    MetodoPago: "efectivo",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("⚠️ Usuario no autenticado");
      return;
    }

    if (!form.fkid_producto || !form.Cantidad || !form.MetodoPago) {
      alert("⚠️ Por favor completa todos los campos");
      return;
    }

    const payload = {
      fkid_producto: parseInt(form.fkid_producto),
      Cantidad: parseInt(form.Cantidad),
      MetodoPago: form.MetodoPago,
      fkid_usuario: user.id,
    };

    try {
      const res = await fetch("http://localhost:3001/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Venta registrada correctamente");
        setForm({ fkid_producto: "", Cantidad: "", MetodoPago: "efectivo" });
        fetchProductos();
      } else {
        alert("⚠️ " + (data.message || "No se pudo registrar la venta"));
      }
    } catch (err) {
      alert("❌ Error en el servidor: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">
          Registrar Venta Interna
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-md bg-white p-6 rounded shadow space-y-4"
        >
          <select
            name="fkid_producto"
            value={form.fkid_producto}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Selecciona un producto --</option>
            {productos.map((prod) => (
              <option key={prod.id_producto} value={prod.id_producto}>
                {prod.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="Cantidad"
            value={form.Cantidad}
            onChange={handleChange}
            placeholder="Cantidad"
            min={1}
            required
            className="w-full p-2 border rounded"
          />

          <select
            name="MetodoPago"
            value={form.MetodoPago}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Registrar Venta
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterSale;
