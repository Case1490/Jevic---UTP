import { useEffect, useState } from "react";
import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import RegisterSupplier from "../../components/RegisterSupplier";
import EditSupplier from "../../components/EditSupplier";
import Sidebar from "../../components/Sidebar";

const Suppliers = () => {
  const [proveedores, setProveedores] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  const fetchProveedores = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/proveedores");
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleEditClick = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setMostrarModalEditar(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Deseas eliminar este proveedor?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3001/api/proveedores/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Proveedor eliminado");
        fetchProveedores();
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      alert("⚠️ Error al eliminar: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--blue-main)]">
            Proveedores
          </h1>
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Añadir proveedor
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {proveedores.map((proveedor) => (
            <div
              key={proveedor.id_proveedores}
              className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-[var(--blue-main)] mb-2">
                {proveedor.nombre_empresa}
              </h2>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Teléfono:</span>{" "}
                {proveedor.telefono}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Correo:</span> {proveedor.correo}
              </p>

              <div className="mt-3 flex justify-between items-center">
                <button
                  className="text-sm px-3 py-1 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
                  onClick={() => handleEditClick(proveedor)}
                >
                  Editar
                </button>
                <button
                  className="text-sm px-3 py-1 rounded-md border border-red-500 text-red-600 hover:bg-blue-50 transition"
                  onClick={() => handleDelete(proveedor.id_proveedores)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {mostrarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-xl"
                onClick={() => setMostrarModal(false)}
              >
                &times;
              </button>
              <RegisterSupplier
                onSuccess={() => {
                  setMostrarModal(false);
                  fetchProveedores(); // recargar proveedores
                }}
              />
            </div>
          </div>
        )}
        {mostrarModalEditar && proveedorSeleccionado && (
          <EditSupplier
            supplierData={proveedorSeleccionado}
            onClose={() => setMostrarModalEditar(false)}
            onSuccess={fetchProveedores}
          />
        )}
      </main>
    </div>
  );
};

export default Suppliers;
