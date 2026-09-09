import { useMemo, useState } from "react";
import VendedorLayout from "../../components/dashboardCajero/VendedorLayout";
import MetricCards, { type Metrica } from "../../components/dashboardCajero/MetricCards";
import MetaMensual from "../../components/dashboardCajero/MetaMensual";
import VentasChart from "../../components/dashboardCajero/VentasChart";
import SemanaChart from "../../components/dashboardCajero/SemanaChart";
import ActividadReciente from "../../components/dashboardCajero/ActividadReciente";
import DetalleVentasMes, {
  DetalleVentasHoy,
} from "../../components/dashboardCajero/DetalleVentasMes";
import CargandoVendedor from "../../components/dashboardCajero/CargandoVendedor";
import useVendedorData from "../../hooks/useVendedorData";

import "./VendedorDashboard.css";

const META_OBJETIVO = 25000;
const META_DIARIA = 4000;

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const obtenerFecha = (fecha?: string) => {
  if (!fecha) return null;
  const fechaParseada = new Date(fecha);
  return Number.isNaN(fechaParseada.getTime()) ? null : fechaParseada;
};

const haceCuanto = (fecha?: string) => {
  const fechaValida = obtenerFecha(fecha);
  if (!fechaValida) return "recientemente";

  const minutos = Math.round((Date.now() - fechaValida.getTime()) / 60000);

  if (minutos < 1) return "hace un momento";
  if (minutos < 60) return `Hace ${minutos} min`;
  if (minutos < 1440) return `Hace ${Math.round(minutos / 60)} h`;

  const dias = Math.round(minutos / 1440);
  if (dias === 1) return "Ayer";
  return `Hace ${dias} días`;
};

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
  const { ventas, clientes, usandoMock, cargando } = useVendedorData();
  const [verDetalleMes, setVerDetalleMes] = useState(false);
  const [verDetalleHoy, setVerDetalleHoy] = useState(false);

  const nombre = obtenerUsuario();

  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  const confirmadas = useMemo(
    () => ventas.filter((venta) => venta.estado === "Confirmada"),
    [ventas],
  );

  const ventasDelMes = useMemo(() => {
    const ahora = new Date();

    return ventas.filter((venta) => {
      const fechaVenta = obtenerFecha(venta.fechaISO);
      return (
        fechaVenta &&
        fechaVenta.getMonth() === ahora.getMonth() &&
        fechaVenta.getFullYear() === ahora.getFullYear()
      );
    });
  }, [ventas]);

  const confirmadasDelMes = useMemo(() => {
    const ahora = new Date();

    return confirmadas.filter((venta) => {
      const fechaVenta = obtenerFecha(venta.fechaISO);
      return (
        fechaVenta &&
        fechaVenta.getMonth() === ahora.getMonth() &&
        fechaVenta.getFullYear() === ahora.getFullYear()
      );
    });
  }, [confirmadas]);

  const movimientosDelMes = useMemo(
    () => ventasDelMes.filter((venta) => venta.estado !== "Anulada"),
    [ventasDelMes],
  );

  const ventasDeHoy = useMemo(() => {
    const ahora = new Date();

    return ventas.filter((venta) => {
      const fechaVenta = obtenerFecha(venta.fechaISO);
      return fechaVenta && fechaVenta.toDateString() === ahora.toDateString();
    });
  }, [ventas]);

  const movimientosDeHoy = useMemo(
    () => ventasDeHoy.filter((venta) => venta.estado !== "Anulada"),
    [ventasDeHoy],
  );

  const sumarVentas = (lista: { monto: number }[]) =>
    lista.reduce((acumulado, venta) => acumulado + venta.monto, 0);

  const metricas: Metrica[] | undefined = usandoMock
    ? undefined
    : [
        {
          titulo: "Mis ventas del mes",
          valor: String(movimientosDelMes.length),
          detalle: `${movimientosDelMes.length === 1 ? "venta" : "ventas"} del mes`,
          colorDetalle: "purple",
          onClick: () => setVerDetalleMes(true),
        },
        {
          titulo: "Ventas de hoy",
          valor: String(movimientosDeHoy.length),
          detalle: `${movimientosDeHoy.length === 1 ? "venta" : "ventas"} hoy`,
          colorDetalle: "green",
          onClick: () => setVerDetalleHoy(true),
        },
        {
          titulo: "Mis clientes",
          valor: String(clientes.length),
          detalle: "clientes registrados",
          colorDetalle: "blue",
        },
        {
          titulo: "Ticket promedio",
          valor: confirmadas.length
            ? formatoCOP(Math.round(sumarVentas(confirmadas) / confirmadas.length))
            : "$ 0",
          detalle: "promedio de ventas confirmadas",
          colorDetalle: "orange",
        },
      ];

  const ventasMensuales = useMemo(() => {
    const ahora = new Date();
    const serie = [];

    for (let i = 6; i >= 0; i--) {
      const mes = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);

      const total = confirmadas
        .filter((venta) => {
          const fechaVenta = obtenerFecha(venta.fechaISO);
          return (
            fechaVenta &&
            fechaVenta.getMonth() === mes.getMonth() &&
            fechaVenta.getFullYear() === mes.getFullYear()
          );
        })
        .reduce((acumulado, venta) => acumulado + venta.monto, 0);

      serie.push({ mes: MESES[mes.getMonth()], ventas: total });
    }

    return serie;
  }, [confirmadas]);

  const semana = useMemo(() => {
    const ahora = new Date();
    const lunes = new Date(ahora);
    lunes.setDate(ahora.getDate() - ((ahora.getDay() + 6) % 7));

    return DIAS_SEMANA.map((dia, index) => {
      const fechaDia = new Date(lunes);
      fechaDia.setDate(lunes.getDate() + index);

      const real = confirmadas
        .filter((venta) => {
          const fechaVenta = obtenerFecha(venta.fechaISO);
          return fechaVenta && fechaVenta.toDateString() === fechaDia.toDateString();
        })
        .reduce((acumulado, venta) => acumulado + venta.monto, 0);

      return { dia, real, meta: META_DIARIA };
    });
  }, [confirmadas]);

  const actividades = useMemo(() => {
    const ordenadas = [...confirmadas]
      .sort((a, b) =>
        (b.fechaISO || b.fecha).localeCompare(a.fechaISO || a.fecha),
      )
      .slice(0, 4);

    return ordenadas.map((venta) => ({
      accion: "Venta registrada",
      cliente: venta.cliente,
      monto: venta.monto,
      hora: haceCuanto(venta.fechaISO),
    }));
  }, [confirmadas]);

  const mesTextoSpan = () => {
    const ahora = new Date();
    return `${
      MESES[ahora.getMonth()]
    } ${ahora.getFullYear()} · ${formatoCOP(sumarVentas(ventasDelMes))} de ${formatoCOP(META_OBJETIVO)}`;
  };

  return (
    <VendedorLayout vista="Mi Dashboard">
      <div className="vdash-flex">
        {cargando ? (
          <CargandoVendedor />
        ) : verDetalleMes ? (
          <DetalleVentasMes
            ventas={ventasDelMes}
            onVolver={() => setVerDetalleMes(false)}
          />
        ) : verDetalleHoy ? (
          <DetalleVentasHoy
            ventas={ventasDeHoy}
            onVolver={() => setVerDetalleHoy(false)}
          />
        ) : (
        <>
        <div>
          <h1 className="vdash-titulo">Buen día, {nombre}</h1>
          <p className="vdash-fecha">{fechaCapitalizada} · Tus métricas de hoy</p>
        </div>

        <MetricCards metricas={metricas} />

        <MetaMensual
          actual={usandoMock ? undefined : sumarVentas(confirmadasDelMes)}
          objetivo={META_OBJETIVO}
          mesTexto={usandoMock ? undefined : mesTextoSpan()}
        />

        <div className="vdash-charts-row">
          <VentasChart data={usandoMock ? undefined : ventasMensuales} />
          <SemanaChart data={usandoMock ? undefined : semana} />
        </div>

        <ActividadReciente actividades={usandoMock ? undefined : actividades} />
        </>
        )}
      </div>
    </VendedorLayout>
  );
};

export default VendedorDashboard;