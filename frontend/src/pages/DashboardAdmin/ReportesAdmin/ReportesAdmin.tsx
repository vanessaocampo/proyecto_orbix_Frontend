import { Search, Bell, Download } from "lucide-react";
import { useState } from "react";

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
    <>
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

      </>
);
};

export default ReportesAdmin;