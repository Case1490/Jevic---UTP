import { useEffect, useState } from "react";
import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import RegisterUser from "../../components/RegisterUser";
import EditUser from "../../components/EditUser";

const Users = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Usuario eliminado");
        fetchUsuarios();
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      alert("⚠️ Error al eliminar: " + err.message);
    }
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
          <Link
            to="/admin/usuarios"
            className="flex items-center gap-2 bg-[var(--blue-second)] rounded-full p-2"
          >
            <FaUsers /> <span>Usuarios</span>
          </Link>
          <Link
            to="/admin/registrar-producto"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice /> <span>Registrar Producto</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--blue-main)]">
            Usuarios Internos
          </h1>
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Añadir usuario
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id_usuarios}
              className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-[var(--blue-main)] mb-2">
                {usuario.nombre_usu} {usuario.apellido_usu}
              </h2>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Correo:</span> {usuario.correo}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Rol:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                    usuario.rol === "admin" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {usuario.rol}
                </span>
              </p>
              <div className="mt-2 flex justify-between">
                <button
                  className="text-sm text-blue-600 underline hover:text-blue-800 mt-2 mr-3"
                  onClick={() => {
                    setUsuarioSeleccionado(usuario);
                    setMostrarModalEditar(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-sm text-red-600 underline hover:text-red-800"
                  onClick={() => handleDelete(usuario.id_usuarios)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de registro */}
        {mostrarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-xl"
                onClick={() => setMostrarModal(false)}
              >
                &times;
              </button>
              <RegisterUser
                onSuccess={() => {
                  setMostrarModal(false);
                  fetchUsuarios();
                }}
              />
            </div>
          </div>
        )}

        {mostrarModalEditar && usuarioSeleccionado && (
          <EditUser
            userData={usuarioSeleccionado}
            onClose={() => {
              setMostrarModalEditar(false);
              setUsuarioSeleccionado(null);
            }}
            onSuccess={() => {
              setMostrarModalEditar(false);
              fetchUsuarios(); // recargar lista tras editar
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Users;
