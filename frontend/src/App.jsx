import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import HomeRedirect from "./pages/Home/HomeRedirect";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Suppliers from "./pages/admin/Suppliers";
import Users from "./pages/admin/Users";
import RegisterProduct from "./pages/admin/RegisterProduct";
import ListProducts from "./pages/admin/ListProducts";
import EditProduct from "./pages/admin/EditProduct";
import RegisterShop from "./pages/admin/RegisterShop";
import PurchaseHistory from "./pages/admin/PurchaseHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editar-producto/:id"
          element={
            <ProtectedRoute role="admin">
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lista-productos"
          element={
            <ProtectedRoute role="admin">
              <ListProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/registrar-compra"
          element={
            <ProtectedRoute role="admin">
              <RegisterShop />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/proveedores"
          element={
            <ProtectedRoute role="admin">
              <Suppliers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/historial-compras"
          element={
            <ProtectedRoute role="admin">
              <PurchaseHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/registrar-producto"
          element={
            <ProtectedRoute role="admin">
              <RegisterProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
