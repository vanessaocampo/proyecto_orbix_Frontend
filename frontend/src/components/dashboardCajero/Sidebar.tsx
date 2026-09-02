import { LayoutGrid, ShoppingBag, Users, Receipt, Target } from "lucide-react";
import { useLocation } from "react-router-dom";
import LogoutButton from "../LogoutButton";

import "./Sidebar.css";

const ITEMS = [
  { path: "/dashboard/vendedor", label: "Mi Dashboard", icon: LayoutGrid },
  { path: "/dashboard/vendedor/productos", label: "Productos", icon: ShoppingBag },
  { path: "/dashboard/vendedor/clientes", label: "Mis Clientes", icon: Users },
  { path: "/dashboard/vendedor/ventas", label: "Mis Ventas", icon: Receipt },
];

const obtenerUsuario = () => {
  try {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      return { nombre: "Vendedor", iniciales: "VD" };
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

    return {
      nombre,
      iniciales: iniciales || "VD",
    };
  } catch {
    return { nombre: "Vendedor", iniciales: "VD" };
  }
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const { nombre, iniciales } = obtenerUsuario();

  return (
    <aside className="vendedor-sidebar">
      {/* Logo */}
      <div className="vendedor-sidebar-top">
        <div className="vendedor-logo">
          <div className="vendedor-logo-icono">
            <Target size={18} />
          </div>
          <span className="vendedor-logo-nombre">Orbix</span>
        </div>

        <span className="vendedor-badge-rol">Vendedor</span>
      </div>

      {/* Navegación */}
      <p className="vendedor-nav-label">MENÚ</p>
      <nav className="vendedor-nav">
        {ITEMS.map(({ path, label, icon: Icon }) => {
          const activo = pathname === path;
          return (
            <a key={path} href={path} className={activo ? "activo" : ""}>
              <Icon size={18} />
              <span>{label}</span>
            </a>
          );
        })}
      </nav>

      {/* Pie: usuario + cerrar perfil */}
      <div className="vendedor-sidebar-footer">
        <div className="vendedor-usuario-info">
          <div className="vendedor-avatar">{iniciales}</div>
          <div className="vendedor-usuario-texto">
            <strong>{nombre}</strong>
            <span>Vendedor</span>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;