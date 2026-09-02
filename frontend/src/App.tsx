import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import NotFoundRedirect from "./routes/NotFoundRedirect";

import LoginAdmin from "./pages/LoginAdmin/LoginAdmin";

import LoginOpera from "./pages/LoginOpera/LoginOpera";

import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";

import VendedorDashboard from "./pages/Vendedor/VendedorDashboard";

import VendedorProductos from "./pages/Vendedor/VendedorProductos";

import VendedorClientes from "./pages/Vendedor/VendedorClientes";

import VendedorVentas from "./pages/Vendedor/VendedorVentas";

import DashboardInventario from "./pages/DashboardInventario/DashboardInventario";
import LayoutInventario from "./components/dashboardInventario/LayoutInventario";
import ProductosInventario from "./pages/DashboardInventario/ProductosInventario";
import MovimientosInventario from "./pages/DashboardInventario/MovimientosInventario";
import InventarioAdmin from "./pages/DashboardAdmin/InventarioAdmin/InventarioAdmin";
import VentasAdmin from "./pages/DashboardAdmin/VentasAdmin/VentasAdmin";
import ClientesAdmin from "./pages/DashboardAdmin/ClientesAdmin/ClientesAdmin";
import ProvedoresAdmin from "./pages/DashboardAdmin/ProvedoresAdmin/ProvedoresAdmin";
import ReportesAdmin from "./pages/DashboardAdmin/ReportesAdmin/ReportesAdmin";
import EmpleadosAdmin from "./pages/DashboardAdmin/EmpleadosAdmin/EmpleadosAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Logins */}

        <Route path="/login/admin" element={<LoginAdmin />} />

        <Route path="/login/opera" element={<LoginOpera />} />

        {/* Dashboards */}
        {/* Dashboards para administrador */}

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/inventario"
          element={
            <ProtectedRoute roles={["admin"]}>
              <InventarioAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/ventas"
          element={
            <ProtectedRoute roles={["admin"]}>
              <VentasAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/clientes"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ClientesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/provedores"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ProvedoresAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/reportes"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ReportesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/empleados"
          element={
            <ProtectedRoute roles={["admin"]}>
              <EmpleadosAdmin />
            </ProtectedRoute>
          }
        />

        {/* Dashboards para el vendedor*/}

        <Route
          path="/dashboard/vendedor"
          element={
            <ProtectedRoute roles={["vendedor"]}>
              <VendedorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vendedor/productos"
          element={
            <ProtectedRoute roles={["vendedor"]}>
              <VendedorProductos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vendedor/clientes"
          element={
            <ProtectedRoute roles={["vendedor"]}>
              <VendedorClientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vendedor/ventas"
          element={
            <ProtectedRoute roles={["vendedor"]}>
              <VendedorVentas />
            </ProtectedRoute>
          }
        />

        {/* Dashboards para el inventario*/}

        {/* Módulo de Inventario con Layout y Subrutas */}
        <Route
          path="/dashboard/inventario"
          element={
            <ProtectedRoute roles={["inventario"]}>
              <LayoutInventario />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardInventario />} />
          <Route path="productos" element={<ProductosInventario />} />
          <Route path="movimientos" element={<MovimientosInventario />} />
        </Route>

        {/* Ruta no encontrada */}

        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
