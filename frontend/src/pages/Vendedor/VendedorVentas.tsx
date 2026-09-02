import { useState } from "react";
import { Plus } from "lucide-react";
import VendedorLayout from "../../components/dashboardCajero/VendedorLayout";
import { ventasVendedor, type EstadoVenta } from "../../data/mockDataVendedor";

import "./VendedorVentas.css";

const ESTADOS: ("Todos" | EstadoVenta)[] = [
  "Todos",
  "Completada",
  "En proceso",
  "Pendiente",
  "Cancelada",
];

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const VendedorVentas = () => {
  const [filtroEstado, setFiltroEstado] = useState<"Todos" | EstadoVenta>("Todos");

  const filtradas = ventasVendedor.filter(
    (venta) => filtroEstado === "Todos" || venta.estado === filtroEstado,
  );

  const totalConfirmado = ventasVendedor
    .filter((venta) => venta.estado === "Completada")
    .reduce((acumulado, venta) => acumulado + venta.monto, 0);

  const resumen = [
    { label: "Confirmadas", valor: totalConfirmado, color: "#10b981" },
    { label: "En proceso", valor: ventasVendedor.filter((v) => v.estado === "En proceso").reduce((a, v) => a + v.monto, 0), color: "#3b82f6" },
    { label: "Pendiente", valor: ventasVendedor.filter((v) => v.estado === "Pendiente").reduce((a, v) => a + v.monto, 0), color: "#f59e0b" },
    { label: "Canceladas", valor: ventasVendedor.filter((v) => v.estado === "Cancelada").reduce((a, v) => a + v.monto, 0), color: "#ef4444" },
  ];

  return (
    <VendedorLayout vista="Mis Ventas">
      <div className="vventas-flex">
        <div className="vventas-header">
          <div>
            <h1 className="vventas-titulo">Mis Ventas</h1>
            <p className="vventas-sub">
              {ventasVendedor.length} órdenes · {formatoCOP(totalConfirmado)} confirmado
            </p>
          </div>

          <button className="vventas-registrar">
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
        <div className="vventas-tabla-wrap">
          <table className="vventas-tabla">
            <thead>
              <tr>
                {["N° Pedido", "Cliente", "Items", "Monto", "Pago", "Estado", "Fecha"].map((encabezado) => (
                  <th key={encabezado}>{encabezado}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((venta) => (
                <tr key={venta.id}>
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
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="vventas-vacio">
                    No hay ventas con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </VendedorLayout>
  );
};

export default VendedorVentas;