import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { user } = useUser();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Menú</h2>
      {user.role === "normal" && (
        <>
          <Link to="/kardex" className="block py-2">
            Kardex
          </Link>
          <Link to="/ordenes" className="block py-2">
            Orden de compras
          </Link>
          {/* Más enlaces */}
        </>
      )}
      {user.role === "admin" && (
        <>
          <Link to="/proveedores" className="block py-2">
            Proveedores
          </Link>
          <Link to="/usuarios" className="block py-2">
            Usuarios
          </Link>
          {/* Más enlaces */}
        </>
      )}
    </div>
  );
}
