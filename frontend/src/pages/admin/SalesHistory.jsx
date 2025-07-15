import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const SalesHistory = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/ventas/historial");
        const data = await res.json();
        setVentas(data);
      } catch (err) {
        console.error("Error al cargar historial de ventas:", err);
      }
    };

    fetchVentas();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">
          Historial de Ventas
        </h1>

        {ventas.length === 0 ? (
          <p>No hay ventas registradas.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 border">Producto</th>
                  <th className="p-3 border">Cantidad</th>
                  <th className="p-3 border">Total</th>
                  <th className="p-3 border">Método de Pago</th>
                  <th className="p-3 border">Fecha</th>
                  <th className="p-3 border">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr
                    key={venta.id_venta}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 border">{venta.nombre_producto}</td>
                    <td className="p-3 border">{venta.Cantidad}</td>
                    <td className="p-3 border">S/ {venta.Total.toFixed(2)}</td>
                    <td className="p-3 border capitalize">
                      {venta.MetodoPago}
                    </td>
                    <td className="p-3 border">
                      {new Date(venta.fecha).toLocaleDateString()}
                    </td>
                    <td className="p-3 border">{venta.nombre_usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default SalesHistory;
