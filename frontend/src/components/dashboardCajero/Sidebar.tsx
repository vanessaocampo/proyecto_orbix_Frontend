import { LayoutGrid, ShoppingBag, Users, Receipt, Target, Pin, PinOff } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import "./Sidebar.css";

const ITEMS = [
  { path: "/dashboard/vendedor", label: "Mi Dashboard", icon: LayoutGrid },
  { path: "/dashboard/vendedor/productos", label: "Productos", icon: ShoppingBag },
  { path: "/dashboard/vendedor/clientes", label: "Mis Clientes", icon: Users },
  { path: "/dashboard/vendedor/ventas", label: "Mis Ventas", icon: Receipt },
];

interface SidebarProps {
  isPinned?: boolean;
  onTogglePin?: () => void;
}

const Sidebar = ({ isPinned = true, onTogglePin = () => {} }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <aside className={`vendedor-sidebar ${!isPinned ? "unpinned" : ""}`}>
      {/* Logo */}
      <div className="vendedor-sidebar-top">
        <div className="vendedor-logo">
          <div className="vendedor-logo-icono">
            <Target size={18} />
          </div>
          <span className="vendedor-logo-nombre">Orbix</span>
        </div>

        {isPinned && <span className="vendedor-badge-rol">Vendedor</span>}
      </div>

      {/* Navegación */}
      <p className="vendedor-nav-label">MENÚS</p>
      <nav className="vendedor-nav">
        {ITEMS.map(({ path, label, icon: Icon }) => {
          const activo = pathname === path;
          return (
            <Link key={path} to={path} className={activo ? "activo" : ""}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pie: botón de anclar */}
      <div className="vendedor-sidebar-footer">
        <button 
          className="btn-cambiar-perfil toggle-pin-btn" 
          onClick={onTogglePin}
          title={isPinned ? "Desanclar barra" : "Anclar barra"}
        >
          {isPinned ? <PinOff size={18} /> : <Pin size={18} />}
          <span>{isPinned ? "Desanclar" : "Anclar barra"}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;