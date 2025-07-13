import { FaUsers, FaBoxes } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import CardAdmin from "../../components/CardAdmin";
import Sidebar from "../../components/Sidebar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A77CE3"];
const DashboardAdmin = () => {
  const [resumen, setResumen] = useState({
    totalProductos: 0,
    totalProveedores: 0,
    totalCategorias: 0,
    totalUsuarios: 0,
  });
  const [stockBajo, setStockBajo] = useState([]);
  const [categoriasData, setCategoriasData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "http://localhost:3001/api/dashboard/categorias-count"
      );
      const data = await res.json();
      setCategoriasData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const resResumen = await fetch(
          "http://localhost:3001/api/dashboard/resumen"
        );
        const dataResumen = await resResumen.json();
        setResumen(dataResumen);

        const resStock = await fetch(
          "http://localhost:3001/api/dashboard/stock-bajo"
        );
        const dataStock = await resStock.json();
        setStockBajo(dataStock);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchResumen();
  }, []);

  const LinksAdmin = [
    {
      title: `Productos: ${resumen.totalProductos}`,
      link: "lista-productos",
      bgcolor: "bg-blue-500",
      icon: FaBoxes,
    },
    {
      title: `Proveedores: ${resumen.totalProveedores}`,
      link: "proveedores",
      bgcolor: "bg-indigo-500",
      icon: GrUserWorker,
    },
    {
      title: `Usuarios: ${resumen.totalUsuarios}`,
      link: "usuarios",
      bgcolor: "bg-red-500",
      icon: FaUsers,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] mb-6">
          Dashboard
        </h1>
        {stockBajo.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow">
            <strong>⚠️ Alerta de Stock Bajo:</strong>
            <ul className="mt-2 list-disc list-inside text-sm">
              {stockBajo.map((prod, index) => (
                <li key={index}>
                  {prod.nombre} ({prod.cantidad_compra} unidades)
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {LinksAdmin.map((linkad, index) => (
            <CardAdmin
              key={index}
              title={linkad.title}
              link={linkad.link}
              bgcolor={linkad.bgcolor}
              icon={linkad.icon}
            />
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-700">
            Distribución por marca
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriasData}
                dataKey="cantidad"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoriasData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} productos`} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
