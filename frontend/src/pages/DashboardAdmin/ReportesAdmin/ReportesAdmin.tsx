import { Search, Bell } from "lucide-react";
import { useState } from "react";

import "./ReportesAdmin.css";

import CardsReportes from "../../../components/dashboardAdmin/ReportesAdmin/CardsReportes";
import FiltrosReportes from "../../../components/dashboardAdmin/ReportesAdmin/FiltrosReportes";
import VentasMensuales from "../../../components/dashboardAdmin/ReportesAdmin/VentasMensuales";
import ParticipacionCategoria from "../../../components/dashboardAdmin/ReportesAdmin/ParticipacionCategoria";
import VentasPorPeriodo from "../../../components/dashboardAdmin/ReportesAdmin/VentasPorPeriodo";
import RendimientoEquipo from "../../../components/dashboardAdmin/ReportesAdmin/RendimientoEquipo";

import ReporteVentas from "../../../components/dashboardAdmin/ReportesAdmin/ReporteVentas";
import ReporteInventario from "../../../components/dashboardAdmin/ReportesAdmin/ReporteInventario";
import ReporteClientes from "../../../components/dashboardAdmin/ReportesAdmin/ReporteClientes";
import ReporteFinanciero from "../../../components/dashboardAdmin/ReportesAdmin/ReporteFinanciero";

const ReportesAdmin = () => {
  const [filtro, setFiltro] = useState("Resumen");

  const [reporteActivo, setReporteActivo] = useState<string | null>(null);

  return (
    <main className="reportes-main">
      <Sidebar />

      <div className="reportes-contenido">
        {/* BARRA SUPERIOR */}

        <div className="reportes-barra-superior">
          <p>
            <span className="reportes-orbix">Orbix</span>

            {" / "}

            <span className="reportes-admin">Admin</span>

            {" / "}

            <span className="reportes-titulo">Reportes</span>
          </p>

          <div className="reportes-acciones-superiores">
            <form className="reportes-buscar">
              <Search size={20} />

              <input type="text" placeholder="Buscar..." />
            </form>

            <div className="reportes-notifi">
              <Bell size={20} />
            </div>

            <div className="reportes-usuario">VO</div>
          </div>
        </div>

        {/* PANTALLA PRINCIPAL DE REPORTES */}

        {!reporteActivo && (
          <>
            {/* ENCABEZADO */}

            <div className="reportes-encabezado">
              <div>
                <h2>Reportes</h2>

                <p className="reportes-fecha">
                  Análisis y métricas del negocio · Período:{" "}
                  {new Date().toLocaleDateString("es-CO", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* CARDS */}

            <CardsReportes
              onGenerarVentas={() => setReporteActivo("ventas")}
              onGenerarInventario={() => setReporteActivo("inventario")}
              onGenerarClientes={() => setReporteActivo("clientes")}
              onGenerarFinanciero={() => setReporteActivo("financiero")}
            />

            {/* FILTROS */}

            <FiltrosReportes filtro={filtro} setFiltro={setFiltro} />

            {/* RESUMEN */}

            {filtro === "Resumen" && (
              <div className="reportes-resumen">
                <VentasMensuales />

                <ParticipacionCategoria />
              </div>
            )}

            {/* VENTAS POR PERIODO */}

            {filtro === "Ventas por periodo" && <VentasPorPeriodo />}

            {/* RENDIMIENTO DEL EQUIPO */}

            {filtro === "Rendimiento equipo" && <RendimientoEquipo />}
          </>
        )}

        {/* REPORTE DE VENTAS */}

        {reporteActivo === "ventas" && (
          <ReporteVentas onVolver={() => setReporteActivo(null)} />
        )}

        {/* REPORTE DE INVENTARIO */}

        {reporteActivo === "inventario" && (
          <ReporteInventario onVolver={() => setReporteActivo(null)} />
        )}

        {/* REPORTE DE CLIENTES */}

        {reporteActivo === "clientes" && (
          <ReporteClientes onVolver={() => setReporteActivo(null)} />
        )}

        {/* REPORTE FINANCIERO */}

        {reporteActivo === "financiero" && (
          <ReporteFinanciero onVolver={() => setReporteActivo(null)} />
        )}
      </div>
    </main>
  );
};

export default ReportesAdmin;
