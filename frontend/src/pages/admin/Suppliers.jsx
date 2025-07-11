import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

const Suppliers = () => {
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
          <Link
            to="/admin/proveedores"
            className="flex items-center gap-2 p-2 bg-[var(--blue-second)] rounded-full"
          >
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
          Proveedores
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              nombre: "Tech Supplies S.A.",
              contacto: "Juan Pérez",
              telefono: "987654321",
            },
            {
              nombre: "Electro Mundial",
              contacto: "Ana López",
              telefono: "912345678",
            },
            {
              nombre: "Mega Import",
              contacto: "Carlos Ruiz",
              telefono: "955321456",
            },
            {
              nombre: "Distribuidora Lima",
              contacto: "Lucía Torres",
              telefono: "900112233",
            },
          ].map((proveedor, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-[var(--blue-main)] mb-2">
                {proveedor.nombre}
              </h2>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Contacto:</span>{" "}
                {proveedor.contacto}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Teléfono:</span>{" "}
                {proveedor.telefono}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Suppliers;
