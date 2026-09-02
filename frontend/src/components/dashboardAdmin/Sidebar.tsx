import {
  LayoutDashboard,
  SquareLibrary,
  ShoppingBag,
  Users,
  Truck,
  ChartNoAxesCombined,
  IdCard
} from "lucide-react";
import LogoutButton from "../LogoutButton";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-titulo">
        <h2 className="siti">Orbix</h2>
        <p className="sitip">Gestón Empresarial</p>
      </div>
      <nav className="navegacion">
        <p className="navp">PRINCIPAL</p>
        <a href="/dashboard/admin">
          <LayoutDashboard size={22} />
          <span>Dashboard</span>
        </a>

        <a href="/dashboard/admin/inventario">
          <SquareLibrary size={22} />
          <span>Inventario</span>
        </a>
        <a href="/dashboard/admin/ventas">
          <ShoppingBag size={22} />
          <span>ventas</span>
        </a>
        <a href="/dashboard/admin/clientes">
          <Users size={22} />
          <span>Clientes</span>
        </a>
        <a href="/dashboard/admin/provedores">
          <Truck size={22} />
          <span>Proveedores</span>
        </a>
        <a href="/dashboard/admin/reportes">
          <ChartNoAxesCombined size={22} />
          <span>Reportes</span>
        </a>
        <a href="/dashboard/admin/empleados">
          <IdCard size={22} />
          <span>Empleados</span>
        </a>
      </nav>
      <LogoutButton />
    </aside>
  );
};

export default Sidebar;
