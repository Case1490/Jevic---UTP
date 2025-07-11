import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

const ListProducts = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      const res = await fetch("http://localhost:3001/api/productos");
      const data = await res.json();
      console.log("🟢 Productos recibidos:", data);
      setProductos(data);
    };
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          Swal.fire(
            "¡Eliminado!",
            "El producto fue eliminado correctamente.",
            "success"
          );
          // Recargar la lista
          setProductos((prev) => prev.filter((p) => p.id_producto !== id));
        } else {
          const err = await res.json();
          Swal.fire("Error", err.message || "Error al eliminar", "error");
        }
      } catch (error) {
        Swal.fire("Error de red", error.message, "error");
      }
    }
  };

  const handleEdit = (producto) => {
    navigate(`/admin/editar-producto/${producto.id_producto}`);
  };

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
            <FaUsers /> <span>Usuarios</span>
          </Link>
          <Link
            to="/admin/registrar-producto"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice /> <span>Registrar Producto</span>
          </Link>
          <Link
            to="/admin/lista-productos"
            className="flex items-center gap-2 p-2 bg-[var(--blue-second)] rounded-full"
          >
            <FaFileInvoice />
            <span>Ver Productos</span>
          </Link>
          <Link
            to="/admin/registrar-compra"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice />
            <span>Registrar Compra</span>
          </Link>
        </nav>
      </aside>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Productos Registrados</h2>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Almacén</th>
              <th className="border p-2">Categoría</th>
              <th className="border p-2">Precio (S/)</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Proveedor</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod, i) => (
              <tr key={prod.id_producto}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{prod.nombre}</td>
                <td className="border p-2">{prod.ubicacion_almacen}</td>
                <td className="border p-2">{prod.categoria_marca}</td>
                <td className="border p-2 text-right">
                  {prod.precio_unitario}
                </td>
                <td className="border p-2 text-center">
                  {prod.cantidad_compra}
                </td>
                <td className="border p-2">{prod.proveedor}</td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id_producto)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProducts;
