import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  LogOut,
  X,
  Pin,
  PinOff
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./SidebarInventario.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
}

const SidebarInventario = ({ isOpen, onClose, isPinned, onTogglePin }: SidebarProps) => {
  return (
    <>
      {/* Overlay oscuro para cerrar al hacer clic afuera en móviles */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar-inventario ${isOpen ? 'open' : ''} ${isPinned ? 'pinned' : 'unpinned'}`}>
        <div className="sidebar-titulo-inv">
          <div className="logo-container">
            <div className="logo-icon">
              <span className="logo-inner-circle"></span>
            </div>
            <h2 className="siti-inv">Orbix</h2>
          </div>
          <span className="badge-inventario">Inventario</span>
          {/* Botón X visible solo en móvil */}
          <button className="close-sidebar-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="navegacion-inv">
          <p className="navp-inv">MENÚ</p>
          <NavLink to="/dashboard/inventario" end className={({ isActive }) => (isActive ? "active" : "")} onClick={onClose}>
            <LayoutDashboard size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/dashboard/inventario/productos" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClose}>
            <Package size={22} />
            <span>Productos</span>
          </NavLink>
          
          <NavLink to="/dashboard/inventario/movimientos" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClose}>
            <ArrowRightLeft size={22} />
            <span>Movimientos</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer-inv">
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
    </>
  );
};

export default SidebarInventario;
