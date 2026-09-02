import VendedorLayout from "../../components/dashboardCajero/VendedorLayout";
import MetricCards from "../../components/dashboardCajero/MetricCards";
import MetaMensual from "../../components/dashboardCajero/MetaMensual";
import VentasChart from "../../components/dashboardCajero/VentasChart";
import SemanaChart from "../../components/dashboardCajero/SemanaChart";
import ActividadReciente from "../../components/dashboardCajero/ActividadReciente";

import "./VendedorDashboard.css";

const obtenerUsuario = () => {
  try {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      return "Vendedor";
    }

    const usuario = JSON.parse(usuarioGuardado);

    const nombre: string = usuario?.nombre ?? "Vendedor";

    return nombre.trim().split(/\s+/)[0] || "Vendedor";
  } catch {
    return "Vendedor";
  }
};

const VendedorDashboard = () => {
  const nombre = obtenerUsuario();

  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  return (
    <VendedorLayout vista="Mi Dashboard">
      <div className="vdash-flex">
        <div>
          <h1 className="vdash-titulo">Buen día, {nombre}</h1>
          <p className="vdash-fecha">{fechaCapitalizada} · Tus métricas de hoy</p>
        </div>

        <MetricCards />

        <MetaMensual />

        <div className="vdash-charts-row">
          <VentasChart />
          <SemanaChart />
        </div>

        <ActividadReciente />
      </div>
    </VendedorLayout>
  );
};

export default VendedorDashboard;