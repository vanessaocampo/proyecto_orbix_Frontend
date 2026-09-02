import { Search, Bell, Download } from "lucide-react";
import { useState } from "react";

import Sidebar from "../../../components/dashboardAdmin/Sidebar";

import "./ReportesAdmin.css";

import CardsReportes from "../../../components/dashboardAdmin/ReportesAdmin/CardsReportes";
import FiltrosReportes from "../../../components/dashboardAdmin/ReportesAdmin/FiltrosReportes";
import VentasMensuales from "../../../components/dashboardAdmin/ReportesAdmin/VentasMensuales";
import ParticipacionCategoria from "../../../components/dashboardAdmin/ReportesAdmin/ParticipacionCategoria";
import VentasPorPeriodo from "../../../components/dashboardAdmin/ReportesAdmin/VentasPorPeriodo";
import RendimientoEquipo from "../../../components/dashboardAdmin/ReportesAdmin/RendimientoEquipo";

const ReportesAdmin = () => {
  const [filtro, setFiltro] = useState("Resumen");

  return (
    <main className="reportes-main">
      <Sidebar />

      <div className="reportes-contenido">

        {/* BARRA SUPERIOR */}

        <div className="reportes-barra-superior">
          <p>
            <span className="reportes-orbix">Orbix</span> /{" "}
            <span className="reportes-admin">Admin</span> /{" "}
            <span className="reportes-titulo">Reportes</span>
          </p>

          <div className="reportes-acciones-superiores">
            <form className="reportes-buscar">
              <Search size={20} />

              <input
                type="text"
                placeholder="Buscar..."
              />
            </form>

            <div className="reportes-notifi">
              <Bell size={20} />
            </div>

            <div className="reportes-usuario">
              VO
            </div>
          </div>
        </div>

        {/* ENCABEZADO */}

        <div className="reportes-encabezado">
          <div>
            <h2>Reportes</h2>

            <p className="reportes-fecha">
              Análisis y métricas del negocio · Período: julio 2026
            </p>
          </div>

          <button className="reportes-button-agregar">
            <Download size={20} />

            Descargar PDF
          </button>
        </div>

        {/* CARDS DE REPORTES */}

        <CardsReportes />

        {/* FILTROS */}

        <FiltrosReportes
          filtro={filtro}
          setFiltro={setFiltro}
        />

        {/* CONTENIDO SEGÚN EL FILTRO */}

        {filtro === "Resumen" && (
          <div className="reportes-resumen">
            <VentasMensuales />

            <ParticipacionCategoria />
          </div>
        )}

        {filtro === "Ventas por periodo" && (
          <VentasPorPeriodo />
        )}

        {filtro === "Rendimiento equipo" && (
          <RendimientoEquipo />
        )}

      </div>
    </main>
  );
};

export default ReportesAdmin;