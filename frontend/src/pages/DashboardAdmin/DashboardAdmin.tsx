import CarsDatos from "../../components/dashboardAdmin/CarsDatos";

import Ventasanuales from "../../components/dashboardAdmin/ventasAnuales";

import VentasCategorias from "../../components/dashboardAdmin/VentasCategorias";

import UltimasVentas from "../../components/dashboardAdmin/UltimasVentas";

import { Search, Bell } from "lucide-react";

import "./DashboardAdmin.css";
import EstaSemana from "../../components/dashboardAdmin/EstaSemana";

const DashboardAdmin = () => {
  return (
    <>
{/* ENCABEZADO */}

        <div className="dashboard-encabezado">
          <div>
            <h2>Dashboard</h2>

            <p className="dashboard-fecha">
              {new Date().toLocaleDateString("es-CO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
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
