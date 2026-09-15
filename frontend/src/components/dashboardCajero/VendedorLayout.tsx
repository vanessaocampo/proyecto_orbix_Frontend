import React, { useState } from "react";
import { Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import BuscadorGlobal from "./BuscadorGlobal";
import ProfileDropdown from "../ProfileDropdown";
import { Outlet, useLocation } from "react-router-dom";

import "./VendedorLayout.css";

const VendedorLayout = () => {
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  const location = useLocation();

  let vista = "Mi Dashboard";
  if (location.pathname.includes("productos")) vista = "Productos";
  else if (location.pathname.includes("clientes")) vista = "Mis Clientes";
  else if (location.pathname.includes("ventas")) vista = "Mis Ventas";

  return (
    <main className={`vendedor-app ${isSidebarPinned ? 'sidebar-pinned' : 'sidebar-unpinned'}`}>
      {/* Sidebar */}
      <Sidebar isPinned={isSidebarPinned} onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)} />

      {/* Contenido */}
      <div className="vendedor-body">
        {/* Barra superior */}
        <header className="vendedor-topbar">
          <p className="vendedor-breadcrumb">
            <span className="vendedor-breadcrumb-muted">Orbix</span>
            <span className="vendedor-breadcrumb-sep">/</span>
            <span className="vendedor-breadcrumb-rol">Vendedor</span>
            <span className="vendedor-breadcrumb-sep">/</span>
            <strong>{vista}</strong>
          </p>

          <div className="vendedor-topbar-acciones">
            {/* Buscador global */}
            <BuscadorGlobal />

            {/* Notificaciones */}
            <div className="vendedor-notifi">
              <Bell size={15} />
              <span className="vendedor-notifi-dot" />
            </div>

            {/* Usuario */}
            <ProfileDropdown />
          </div>
        </header>

        {/* Contenido de la vista */}
        <main className="vendedor-main"><Outlet /></main>
      </div>
    </main>
  );
};

export default VendedorLayout;
