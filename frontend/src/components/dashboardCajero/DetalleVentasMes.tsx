import { ArrowLeft } from "lucide-react";
import type { VentaVendedor } from "../../data/mockDataVendedor";
import "../../pages/Vendedor/VendedorVentas.css";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const ESTADOS_MES: { label: string; estado: VentaVendedor["estado"]; color: string }[] = [
  { label: "Confirmadas", estado: "Confirmada", color: "#10b981" },
  { label: "Pendientes", estado: "Pendiente", color: "#f59e0b" },
  { label: "Anuladas", estado: "Anulada", color: "#ef4444" },
];

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

type DetalleVentasProps = {
  ventas: VentaVendedor[];
  titulo: string;
  subtitulo: (total: number) => string;
  vacio: string;
  onVolver: () => void;
};

const DetalleVentas = ({ ventas, titulo, subtitulo, vacio, onVolver }: DetalleVentasProps) => {
  const movimientos = ventas.filter((venta) => venta.estado !== "Anulada");
  const total = movimientos.reduce((acumulado, venta) => acumulado + venta.monto, 0);

  const resumen = ESTADOS_MES.map(({ label, estado, color }) => ({
    label,
    color,
    valor: ventas
      .filter((venta) => venta.estado === estado)
      .reduce((acumulado, venta) => acumulado + venta.monto, 0),
  }));

  return (
    <div className="vventas-flex">
      <div className="vventas-header">
        <div>
          <h1 className="vventas-titulo">{titulo}</h1>
          <p className="vventas-sub">{subtitulo(total)}</p>
        </div>

        <button type="button" className="vventas-registrar" onClick={onVolver}>
          <ArrowLeft size={16} />
          Volver al dashboard
        </button>
      </div>

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

      <div className="vventas-tabla-wrap">
        <table className="vventas-tabla">
          <thead>
            <tr>
              {["N° Pedido", "Cliente", "Items", "Monto", "Pago", "Estado", "Fecha"].map(
                (encabezado) => (
                  <th key={encabezado}>{encabezado}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td className="vventas-id">{venta.codigoVenta ?? venta.id}</td>
                <td className="vventas-cliente">{venta.cliente}</td>
                <td className="vventas-items">{venta.items}</td>
                <td className="vventas-monto">{formatoCOP(venta.monto)}</td>
                <td>
                  <span
                    className={`vventas-pago ${
                      venta.pago === "Transferencia"
                        ? "transferencia"
                        : venta.pago === "Tarjeta"
                          ? "tarjeta"
                          : "efectivo"
                    }`}
                  >
                    {venta.pago}
                  </span>
                </td>
                <td>
                  <span
                    className={`vventas-estado ${venta.estado
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {venta.estado}
                  </span>
                </td>
                <td className="vventas-fecha">{venta.fecha}</td>
              </tr>
            ))}
            {ventas.length === 0 && (
              <tr>
                <td colSpan={7} className="vventas-vacio">
                  {vacio}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DetalleVentasMes = ({ ventas, onVolver }: { ventas: VentaVendedor[]; onVolver: () => void }) => {
  const ahora = new Date();
  const mesTexto = `${MESES[ahora.getMonth()]} ${ahora.getFullYear()}`;
  const activas = ventas.filter((venta) => venta.estado !== "Anulada");

  return (
    <DetalleVentas
      ventas={ventas}
      titulo={`Ventas de ${mesTexto}`}
      subtitulo={(total) =>
        `${activas.length} ${activas.length === 1 ? "venta" : "ventas"} · ${formatoCOP(total)} en el mes`
      }
      vacio="Aún no hay ventas en este mes."
      onVolver={onVolver}
    />
  );
};

const DetalleVentasHoy = ({ ventas, onVolver }: { ventas: VentaVendedor[]; onVolver: () => void }) => {
  const hoy = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const activas = ventas.filter((venta) => venta.estado !== "Anulada");

  return (
    <DetalleVentas
      ventas={ventas}
      titulo="Ventas de hoy"
      subtitulo={(total) =>
        `${activas.length} ${activas.length === 1 ? "venta" : "ventas"} · ${formatoCOP(total)} el ${hoy}`
      }
      vacio="Aún no hay ventas registradas hoy."
      onVolver={onVolver}
    />
  );
};

export { DetalleVentasHoy };
export default DetalleVentasMes;