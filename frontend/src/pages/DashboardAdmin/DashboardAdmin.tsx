import Sidebar from "../../components/dashboardAdmin/Sidebar";

import CarsDatos from "../../components/dashboardAdmin/CarsDatos";

import Ventasanuales from "../../components/dashboardAdmin/ventasAnuales";

import VentasCategorias from "../../components/dashboardAdmin/VentasCategorias";

import UltimasVentas from "../../components/dashboardAdmin/UltimasVentas";

import { Search, Bell, Download } from "lucide-react";

import "./DashboardAdmin.css";
import EstaSemana from "../../components/dashboardAdmin/EstaSemana";

const DashboardAdmin = () => {
  return (
    <main className="dashboard-main">
      <Sidebar />

      <div className="dashboard-contenido">
        {/* BARRA SUPERIOR */}

        <div className="dashboard-barra-superior">
          <p>
            <span className="dashboard-orbix">Orbix</span> /{" "}
            <span className="dashboard-admin">Admin</span> /{" "}
            <span className="dashboard-titulo">Dashboard</span>
          </p>

          <div className="dashboard-acciones-superiores">
            <form className="dashboard-buscar">
              <Search size={20} />

              <input type="text" placeholder="Buscar..." />
            </form>

            <div className="dashboard-notifi">
              <Bell size={20} />
            </div>

            <div className="dashboard-usuario">VO</div>
          </div>
        </div>

        {/* ENCABEZADO */}

        <div className="dashboard-encabezado">
          <div>
            <h2>Dashboard</h2>

            <p className="dashboard-fecha">Miércoles, 30 de julio de 2026</p>
          </div>

          <button className="dashboard-button-exportar">
            <Download size={20} />
            Exportar reporte
          </button>
        </div>

        <CarsDatos />

        <div className="graficas-dashboard">
          <Ventasanuales />
          <VentasCategorias />
        </div>

        <div className="ventas-dashboard">
          <UltimasVentas />
          <EstaSemana />
        </div>
      </div>
    </main>
  );
};

export default DashboardAdmin;
