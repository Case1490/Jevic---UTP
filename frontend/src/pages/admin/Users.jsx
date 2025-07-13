import { useEffect, useState } from "react";
import RegisterUser from "../../components/RegisterUser";
import EditUser from "../../components/EditUser";
import Sidebar from "../../components/Sidebar";

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
      <Sidebar />
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
              className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Nombre */}
              <h2 className="text-lg font-semibold text-[var(--blue-main)] mb-1 capitalize tracking-wide">
                {usuario.nombre_usu} {usuario.apellido_usu}
              </h2>

              {/* Correo */}
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-700">Correo:</span>{" "}
                <span className="truncate">{usuario.correo}</span>
              </p>

              {/* Rol */}
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium text-gray-700">Rol:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
                    usuario.rol === "admin" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {usuario.rol}
                </span>
              </p>

              {/* Botones */}
              <div className="mt-auto flex justify-end gap-2">
                <button
                  className="text-sm px-3 py-1 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
                  onClick={() => {
                    setUsuarioSeleccionado(usuario);
                    setMostrarModalEditar(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-sm px-3 py-1 rounded-md border border-red-500 text-red-600 hover:bg-red-50 transition"
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
