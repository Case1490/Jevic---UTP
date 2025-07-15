import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Swal from "sweetalert2";
import { useProductos } from "../../context/ProductContext";
import { useEffect } from "react";

const ListProducts = () => {
  const { productos, fetchProductos } = useProductos();
  const navigate = useNavigate();
  console.log(productos);

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
          Swal.fire("¡Eliminado!", "El producto fue eliminado.", "success");
          fetchProductos(); // 🔁 actualiza lista
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

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Productos Registrados</h2>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Almacén</th>
              <th className="border p-2">Marca</th>
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
                  {prod.precio_unitario && prod.precio_unitario !== 0
                    ? parseFloat(prod.precio_unitario).toFixed(2)
                    : "—"}
                </td>
                <td className="border p-2 text-center">
                  {prod.stock_acumulado !== null && prod.stock_acumulado !== 0
                    ? prod.stock_acumulado
                    : "—"}
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
