import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import VendedorLayout from "../../components/dashboardCajero/VendedorLayout";
import CargandoVendedor from "../../components/dashboardCajero/CargandoVendedor";
import RegistrarVenta from "./RegistrarVenta";
import useVendedorData from "../../hooks/useVendedorData";
import vendedorService from "../../services/vendedor.services";
import type { EstadoVenta, VentaVendedor } from "../../data/mockDataVendedor";

import "./VendedorVentas.css";

const ESTADOS: ("Todos" | EstadoVenta)[] = [
  "Todos",
  "Confirmada",
  "Pendiente",
  "Anulada",
];

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

type EstadoNavegacion = {
  abrirRegistro?: boolean;
  productoId?: string;
  clienteId?: string;
  ventaId?: string;
};

const VendedorVentas = () => {
  const { ventas, productos, clientes, refrescar, cargando } = useVendedorData();
  const location = useLocation();
  const navigate = useNavigate();
  const estadoNavegacion = (location.state ?? null) as EstadoNavegacion | null;

  const [estadoNavegacionInicial] = useState(() => estadoNavegacion);

  useEffect(() => {
    if (estadoNavegacionInicial) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [estadoNavegacionInicial, location.pathname, navigate]);

  const [filtroEstado, setFiltroEstado] = useState<"Todos" | EstadoVenta>("Todos");

  const [anulando, setAnulando] = useState<string | null>(null);
  const [errorEstado, setErrorEstado] = useState("");
  const [editandoVenta, setEditandoVenta] = useState<VentaVendedor | null>(null);

  const [ventaResaltada, setVentaResaltada] = useState<string | null>(
    () => estadoNavegacion?.ventaId ?? null,
  );
  const tablaWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ventaResaltada) return;

    const fila = tablaWrapRef.current?.querySelector(
      `[data-venta="${ventaResaltada}"]`,
    );
    fila?.scrollIntoView({ behavior: "smooth", block: "center" });

    const tiempo = window.setTimeout(() => setVentaResaltada(null), 3000);
    return () => window.clearTimeout(tiempo);
  }, [ventaResaltada, ventas]);

  const anularVenta = async (ventaId: string) => {
    const confirmar = window.confirm(
      "¿Anular esta venta? Quedará en el historial con estado Anulada.",
    );
    if (!confirmar) return;

    setAnulando(ventaId);
    setErrorEstado("");

    try {
      await vendedorService.actualizarEstadoVenta(
        vendedorService.idVentaDe(ventaId),
        "cancelada",
      );
      await refrescar();
    } catch (err) {
      setErrorEstado(
        err instanceof Error ? err.message : "Error al anular la venta.",
      );
      await refrescar();
    } finally {
      setAnulando(null);
    }
  };

  const modificarVenta = async (venta: VentaVendedor) => {
    const confirmar = window.confirm(
      "¿Modificar esta venta pendiente? Se cancelará la venta actual y se abrirá el formulario con sus datos para que la vuelvas a registrar.",
    );
    if (!confirmar) return;

    setAnulando(venta.id);
    setErrorEstado("");

    try {
      await vendedorService.actualizarEstadoVenta(
        vendedorService.idVentaDe(venta.id),
        "cancelada",
      );
      await refrescar();
      setEditandoVenta(venta);
      setRegistroActivo(true);
    } catch (err) {
      setErrorEstado(
        err instanceof Error ? err.message : "Error al preparar la modificación.",
      );
      await refrescar();
    } finally {
      setAnulando(null);
    }
  };

  const [registroActivo, setRegistroActivo] = useState(
    () => !!estadoNavegacion?.abrirRegistro,
  );

  const filtradas = ventas.filter(
    (venta) => filtroEstado === "Todos" || venta.estado === filtroEstado,
  );

  const totalConfirmado = ventas
    .filter((venta) => venta.estado === "Confirmada")
    .reduce((acumulado, venta) => acumulado + venta.monto, 0);

  const resumen = [
    { label: "Confirmadas", valor: ventas.filter((v) => v.estado === "Confirmada").reduce((a, v) => a + v.monto, 0), color: "#10b981" },
    { label: "Pendientes", valor: ventas.filter((v) => v.estado === "Pendiente").reduce((a, v) => a + v.monto, 0), color: "#f59e0b" },
    { label: "Anuladas", valor: ventas.filter((v) => v.estado === "Anulada").reduce((a, v) => a + v.monto, 0), color: "#ef4444" },
  ];

  const registrarVenta = () => {
    refrescar();
    setRegistroActivo(true);
  };

  const cerrarRegistro = () => {
    setRegistroActivo(false);
    setEditandoVenta(null);
    navigate(location.pathname, { replace: true, state: null });
  };

  if (registroActivo) {
    return (
      <VendedorLayout vista={editandoVenta ? "Modificar venta" : "Registrar venta"}>
        {cargando ? (
          <CargandoVendedor />
        ) : (
          <RegistrarVenta
            productos={productos}
            clientes={clientes}
            productoInicialId={estadoNavegacion?.productoId}
            clienteInicialId={
              editandoVenta
                ? `CLI-${String(editandoVenta.idCliente ?? 0).padStart(3, "0")}`
                : estadoNavegacion?.clienteId
            }
            itemsIniciales={editandoVenta?.itemsDetalle}
            metodoPagoInicial={editandoVenta?.metodoPago}
            modoEdicion={!!editandoVenta}
            onCerrar={cerrarRegistro}
            onVentaRegistrada={() => {
              refrescar();
              setEditandoVenta(null);
            }}
          />
        )}
      </VendedorLayout>
    );
  }

  return (
    <VendedorLayout vista="Mis Ventas">
      {cargando ? (
        <CargandoVendedor />
      ) : (
      <div className="vventas-flex">
        <div className="vventas-header">
          <div>
            <h1 className="vventas-titulo">Mis Ventas</h1>
            <p className="vventas-sub">
              {ventas.length} órdenes · {formatoCOP(totalConfirmado)} confirmado
            </p>
          </div>

          <button
            className="vventas-registrar"
            onClick={registrarVenta}
          >
            <Plus size={16} />
            Registrar venta
          </button>
        </div>

        {/* Resumen */}
        <div className="vventas-resumen">
          {resumen.map((item) => (
            <div className="vventas-resumen-card" key={item.label}>
              <div className="vventas-resumen-label">
                <span className="vventas-resumen-dot" style={{ backgroundColor: item.color }} />
                <p>{item.label}</p>
              </div>
              <p className="vventas-resumen-valor">{formatoCOP(item.valor)}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="vventas-filtros">
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              className={filtroEstado === estado ? "activo" : ""}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

        {/* Tabla */}
        {errorEstado && <p className="vventas-error">{errorEstado}</p>}
        <div className="vventas-tabla-wrap" ref={tablaWrapRef}>
          <table className="vventas-tabla">
            <thead>
              <tr>
                {["N° Pedido", "Cliente", "Items", "Monto", "Pago", "Estado", "Fecha", "Acción"].map((encabezado) => (
                  <th key={encabezado}>{encabezado}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((venta) => (
                <tr
                  key={venta.id}
                  data-venta={venta.id}
                  className={`vventas-fila${ventaResaltada === venta.id ? " resaltada" : ""}`}
                >
                  <td className="vventas-id">{venta.id}</td>
                  <td className="vventas-cliente">{venta.cliente}</td>
                  <td className="vventas-items">{venta.items}</td>
                  <td className="vventas-monto">{formatoCOP(venta.monto)}</td>
                  <td>
                    <span className={`vventas-pago ${venta.pago === "Transferencia" ? "transferencia" : "efectivo"}`}>
                      {venta.pago}
                    </span>
                  </td>
                  <td>
                    <span className={`vventas-estado ${venta.estado.toLowerCase().replace(/\s+/g, "-")}`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td className="vventas-fecha">{venta.fecha}</td>
                  <td className="vventas-accion">
                    <div className="vventas-acciones">
                      {venta.estado === "Pendiente" && (
                        <button
                          type="button"
                          className="vventas-modificar"
                          disabled={anulando === venta.id}
                          onClick={() => modificarVenta(venta)}
                        >
                          Modificar
                        </button>
                      )}
                      {venta.estado !== "Anulada" && (
                        <button
                          type="button"
                          className="vventas-anular"
                          disabled={anulando === venta.id}
                          onClick={() => anularVenta(venta.id)}
                        >
                          {anulando === venta.id ? "Procesando..." : "Anular"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={8} className="vventas-vacio">
                    No hay ventas con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </VendedorLayout>
  );
};

export default VendedorVentas;