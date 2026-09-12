import CarsDatos from "../../components/dashboardAdmin/CarsDatos";

import Ventasanuales from "../../components/dashboardAdmin/ventasAnuales";

import VentasCategorias from "../../components/dashboardAdmin/VentasCategorias";

import UltimasVentas from "../../components/dashboardAdmin/UltimasVentas";

import { Search, Bell, Download } from "lucide-react";

import "./DashboardAdmin.css";
import EstaSemana from "../../components/dashboardAdmin/EstaSemana";

const DashboardAdmin = () => {
  return (
    <>
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
      </>
);
};

export default DashboardAdmin;
