import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { VendedorDataProvider } from "./context/VendedorDataContext";

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
import LayoutAdmin from "./components/dashboardAdmin/LayoutAdmin";
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

        <Route path="/dashboard/admin" element={<ProtectedRoute roles={["admin"]}><LayoutAdmin /></ProtectedRoute>}>
          <Route index element={<DashboardAdmin />} />
          <Route path="inventario" element={<InventarioAdmin />} />
          <Route path="ventas" element={<VentasAdmin />} />
          <Route path="clientes" element={<ClientesAdmin />} />
          <Route path="provedores" element={<ProvedoresAdmin />} />
          <Route path="reportes" element={<ReportesAdmin />} />
          <Route path="empleados" element={<EmpleadosAdmin />} />
        </Route>

        {/* Dashboards para el vendedor*/}

        <Route
          element={
            <ProtectedRoute roles={["vendedor"]}>
              <VendedorDataProvider>
                <Outlet />
              </VendedorDataProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/vendedor" element={<VendedorDashboard />} />
          <Route
            path="/dashboard/vendedor/productos"
            element={<VendedorProductos />}
          />
          <Route
            path="/dashboard/vendedor/clientes"
            element={<VendedorClientes />}
          />
          <Route path="/dashboard/vendedor/ventas" element={<VendedorVentas />} />
        </Route>

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


