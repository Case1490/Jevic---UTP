import { useUser } from "../../context/UserContext";
import { Navigate } from "react-router-dom";

export default function HomeRedirect() {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" />;

  // Redirige a diferentes rutas según el rol
  if (user.role === "admin") return <Navigate to="/proveedores" />;
  if (user.role === "normal") return <Navigate to="/kardex" />;

  return <div>Rol no reconocido</div>;
}
