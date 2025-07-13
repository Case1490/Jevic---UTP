import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { FaUsers, FaFileInvoice } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: "/admin", icon: MdDashboard, label: "Dashboard" },
    { path: "/admin/proveedores", icon: GrUserWorker, label: "Proveedores" },
    { path: "/admin/usuarios", icon: FaUsers, label: "Usuarios" },
    {
      path: "/admin/lista-productos",
      icon: FaFileInvoice,
      label: "Ver Productos",
    },
    {
      path: "/admin/registrar-producto",
      icon: FaFileInvoice,
      label: "Registrar Producto",
    },

    {
      path: "/admin/registrar-compra",
      icon: FaFileInvoice,
      label: "Registrar Compra",
    },
    {
      path: "/admin/historial-compras",
      icon: FaFileInvoice,
      label: "Historial de Compras",
    },
  ];

  return (
    <aside className="bg-[var(--blue-main)] text-white p-4 space-y-6">
      <h2 className="text-xl font-bold mb-8 uppercase py-1 px-2 rounded-full">
        JevicTecnology
      </h2>
      <nav className="space-y-4">
        {links.map((item) => {
          const isActive = location.pathname === item.path;
          const className = `flex items-center gap-2 p-2 ${
            isActive ? "bg-[var(--blue-second)] rounded-full" : ""
          }`;

          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className={className}>
              <Icon /> <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
