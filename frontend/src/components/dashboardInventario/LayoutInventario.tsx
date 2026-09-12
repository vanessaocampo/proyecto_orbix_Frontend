import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import SidebarInventario from "./SidebarInventario";
import "../../pages/DashboardInventario/DashboardInventario.css";
import { InventoryProvider } from "../../context/InventoryContext";
import ProfileDropdown from "../ProfileDropdown";

const LayoutInventario = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  return (
    <main className="main-inv">
      <SidebarInventario 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isPinned={isSidebarPinned}
        onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)}
      />

      <div className={`contenido-dashboard-inv ${isSidebarPinned ? 'pinned' : 'unpinned'}`}>
        <div className="barra-superior-inv">
          <div className="left-acciones-inv">
            <button className="menu-toggle-inv" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <p className="breadcrumbs-inv">
              <span className="bread-orbix">Orbix</span> <span className="bread-sep">/</span>{" "}
              <span className="bread-inventario">Inventario</span>
            </p>
          </div>

          <div className="acciones-superiores-inv">
            <form className="buscar-inv">
              <Search size={18} />
              <input type="text" placeholder="Buscar..." />
            </form>
            <div className="notifi-inv">
              <Bell size={20} />
            </div>
            <ProfileDropdown />
          </div>
        </div>

        <div className="panel-scroll-inv">
          <InventoryProvider>
            <Outlet />
          </InventoryProvider>
        </div>
      </div>
    </main>
  );
};

export default LayoutInventario;
