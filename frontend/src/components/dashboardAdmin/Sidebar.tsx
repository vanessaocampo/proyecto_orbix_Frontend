import {
  LayoutDashboard,
  SquareLibrary,
  ShoppingBag,
  Users,
  Truck,
  ChartNoAxesCombined,
  IdCard,
  Pin,
  PinOff
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import "./Sidebar.css";

interface SidebarProps {
  isPinned?: boolean;
  onTogglePin?: () => void;
}

const Sidebar = ({ isPinned = true, onTogglePin = () => {} }: SidebarProps) => {
  const { pathname } = useLocation();

  const NAV_ITEMS = [
    { path: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/admin/inventario", label: "Inventario", icon: SquareLibrary },
    { path: "/dashboard/admin/ventas", label: "Ventas", icon: ShoppingBag },
    { path: "/dashboard/admin/clientes", label: "Clientes", icon: Users },
    { path: "/dashboard/admin/provedores", label: "Proveedores", icon: Truck },
    { path: "/dashboard/admin/reportes", label: "Reportes", icon: ChartNoAxesCombined },
    { path: "/dashboard/admin/empleados", label: "Empleados", icon: IdCard },
  ];

  return (
    <aside className={`sidebar ${!isPinned ? "unpinned" : ""}`}>
      <div className="sidebar-titulo">
        <h2 className="siti">Orbix</h2>
        {isPinned && <p className="sitip">Gestión Empresarial</p>}
      </div>
      <nav className="navegacion">
        {isPinned && <p className="navp">PRINCIPAL</p>}
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} className={pathname === path ? "activo" : ""}>
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-footer-inv" style={{ marginTop: 'auto', padding: '20px' }}>
        <button 
          className="btn-cambiar-perfil toggle-pin-btn" 
          onClick={onTogglePin}
          title={isPinned ? "Desanclar barra" : "Anclar barra"}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '12px', width: '100%', borderRadius: '8px', transition: 'all 0.2s' }}
        >
          {isPinned ? <PinOff size={18} /> : <Pin size={18} />}
          <span>{isPinned ? "Desanclar" : "Anclar barra"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
