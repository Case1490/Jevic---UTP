import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { FaUsers, FaFileInvoice, FaSignOutAlt } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

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
    {
      path: "/admin/registrar-venta",
      icon: FaFileInvoice,
      label: "Registrar Venta",
    },
  ];

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <aside className="bg-[var(--blue-main)] text-white p-4 flex flex-col justify-between min-h-screen">
      <div>
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
      </div>

      {/* Sección de usuario y logout */}
      <div className="mt-6 pt-6 border-t border-white/20 text-sm">
        <p className="mb-2">
          Usuario: <span className="font-semibold">{user?.name}</span>
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-full w-full"
        >
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
