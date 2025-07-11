import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

const Users = () => {
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
            className="flex items-center gap-2 p-2 bg-[var(--blue-second)] rounded-full"
          >
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
            className="flex items-center gap-2 p-2"
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

      {/* Main dashboard */}
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] mb-6">
          Usuarios
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              nombre: "María Flores",
              correo: "maria@correo.com",
              rol: "admin",
            },
            {
              nombre: "Pedro Gómez",
              correo: "pedro@correo.com",
              rol: "normal",
            },
            { nombre: "Lucía Díaz", correo: "lucia@correo.com", rol: "normal" },
            {
              nombre: "Carlos Méndez",
              correo: "carlos@correo.com",
              rol: "admin",
            },
          ].map((usuario, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-[var(--blue-main)] mb-2">
                {usuario.nombre}
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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Users;
