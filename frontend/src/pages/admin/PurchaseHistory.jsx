import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const PurchaseHistory = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/compras");
        const data = await res.json();
        setCompras(data);
      } catch (error) {
        console.error("Error al obtener historial de compras:", error);
      }
    };
    fetchCompras();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar current="compras" />

      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] mb-6">
          Historial de Compras
        </h1>

        <div className=" bg-white shadow-md rounded-xl">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Producto</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Precio Unitario (S/)</th>
                <th className="border p-2">Proveedor</th>
                <th className="border p-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id_orden_compra}>
                  <td className="border p-2 text-center">
                    {compra.id_orden_compra}
                  </td>
                  <td className="border p-2">{compra.producto}</td>
                  <td className="border p-2 text-center">
                    {compra.cantidad_compra}
                  </td>
                  <td className="border p-2 text-right">
                    S/ {parseFloat(compra.precio_unitario).toFixed(2)}
                  </td>
                  <td className="border p-2">{compra.proveedor}</td>
                  <td className="border p-2">
                    {new Date(compra.fecha_orden).toLocaleDateString("es-PE")}
                  </td>
                </tr>
              ))}
              {compras.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No hay compras registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default PurchaseHistory;
