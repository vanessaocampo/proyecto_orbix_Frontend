import React from "react";
import { Search, Bell } from "lucide-react";
import Sidebar from "./Sidebar";

import "./VendedorLayout.css";

type VendedorLayoutProps = {
  vista: string;
  children: React.ReactNode;
};

const obtenerUsuario = () => {
  try {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      return { iniciales: "VD" };
    }

    const usuario = JSON.parse(usuarioGuardado);

    const nombre: string = usuario?.nombre ?? "Vendedor";

    const iniciales = nombre
      .trim()
      .split(/\s+/)
      .map((palabra: string) => palabra[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return { iniciales: iniciales || "VD" };
  } catch {
    return { iniciales: "VD" };
  }
};

const VendedorLayout = ({ vista, children }: VendedorLayoutProps) => {
  const { iniciales } = obtenerUsuario();

  return (
    <main className="vendedor-app">
      {/* Sidebar */}
      <Sidebar />

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
            {/* Buscador */}
            <form className="vendedor-buscar">
              <Search size={15} />
              <input type="text" placeholder="Buscar..." />
            </form>

            {/* Notificaciones */}
            <div className="vendedor-notifi">
              <Bell size={15} />
              <span className="vendedor-notifi-dot" />
            </div>

            {/* Usuario */}
            <div className="vendedor-usuario-menu">{iniciales}</div>
          </div>
        </header>

        {/* Contenido de la vista */}
        <main className="vendedor-main">{children}</main>
      </div>
    </main>
  );
};

export default VendedorLayout;