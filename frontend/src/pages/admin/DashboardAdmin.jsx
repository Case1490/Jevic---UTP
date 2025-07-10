import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import CardAdmin from "../../components/CardAdmin";

const DashboardAdmin = () => {
  const LinksAdmin = [
    {
      title: "Proveedores",
      link: "proveedores",
      bgcolor: "bg-blue-600",
      icon: GrUserWorker,
    },
    {
      title: "Usuarios",
      link: "usuarios",
      bgcolor: "bg-red-500",
      icon: FaUsers,
    },
    {
      title: "Registrar Producto",
      link: "registrar-producto",
      bgcolor: "bg-green-600",
      icon: FaFileInvoice,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="bg-[var(--blue-main)] text-white p-4 space-y-6">
        <h2 className="text-xl font-bold mb-8 uppercase py-1 px-2 rounded-full">
          JevicTecnology
        </h2>
        <nav className="space-y-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 p-2  bg-[var(--blue-second)] rounded-full"
          >
            <MdDashboard /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/proveedores" className="flex items-center gap-2 p-2">
            <GrUserWorker /> <span>Proveedores</span>
          </Link>
          <Link to="/admin/usuarios" className="flex items-center gap-2 p-2">
            <FaUsers />
            <span>Usuarios</span>
          </Link>
          <Link
            to="/admin/registrar-producto"
            className="flex items-center gap-2 p-2"
          >
            <FaFileInvoice />
            <span>Registrar Producto</span>
          </Link>
        </nav>
      </aside>

      {/* Main dashboard */}
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-[var(--blue-main)] mb-6">
          Dashboard
        </h1>
        <div className="grid grid-cols-4 gap-4">
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
      </main>
    </div>
  );
};

export default DashboardAdmin;
