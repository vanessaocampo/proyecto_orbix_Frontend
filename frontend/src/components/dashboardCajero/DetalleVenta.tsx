import { X, Package, User, Calendar, CreditCard } from "lucide-react";
import type { EstadoVenta, VentaVendedor } from "../../data/mockDataVendedor";
import "./DetalleVenta.css";

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const estadoClase: Record<EstadoVenta, string> = {
  Confirmada: "confirmada",
  Pendiente: "pendiente",
  Anulada: "anulada",
};

type DetalleVentaProps = {
  venta: VentaVendedor;
  onCerrar: () => void;
};

const DetalleVenta = ({ venta, onCerrar }: DetalleVentaProps) => {
  const detalles = venta.itemsDetalle ?? [];

  return (
    <div className="vdetalle-overlay" onClick={onCerrar}>
      <div
        className="vdetalle"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de la venta ${venta.codigoVenta ?? venta.id}`}
      >
        <button
          type="button"
          className="vdetalle-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="vdetalle-header">
          <div className="vdetalle-titulo-wrap">
            <h3 className="vdetalle-titulo">Detalle de la venta</h3>
            <p className="vdetalle-pedido">{venta.codigoVenta ?? venta.id}</p>
          </div>
          <span
            className={`vdetalle-estado vdetalle-estado-${estadoClase[venta.estado]}`}
          >
            {venta.estado}
          </span>
        </div>

        <div className="vdetalle-info-grid">
          <div className="vdetalle-info-item">
            <User size={14} />
            <span>Cliente</span>
            <strong>{venta.cliente}</strong>
          </div>
          <div className="vdetalle-info-item">
            <Calendar size={14} />
            <span>Fecha</span>
            <strong>{venta.fecha}</strong>
          </div>
          <div className="vdetalle-info-item">
            <CreditCard size={14} />
            <span>Método de pago</span>
            <strong>
              <span
                className={`vdetalle-pago ${
                  venta.pago === "Transferencia" ? "transferencia" : "efectivo"
                }`}
              >
                {venta.pago}
              </span>
            </strong>
          </div>
          <div className="vdetalle-info-item">
            <Package size={14} />
            <span>Productos</span>
            <strong>
              {detalles.reduce((acc, d) => acc + d.cantidad, 0)} u.
            </strong>
          </div>
        </div>

        <div className="vdetalle-items">
          {detalles.length > 0 ? (
            <>
              <div className="vdetalle-items-header">
                <span>PRODUCTO</span>
                <span>CANT.</span>
                <span>P. UNIT.</span>
                <span>SUBTOTAL</span>
              </div>

              {detalles.map((detalle) => (
                <div className="vdetalle-item" key={detalle.idProducto}>
                  <span className="vdetalle-item-nombre">
                    {detalle.nombre}
                  </span>
                  <span className="vdetalle-item-cant">×{detalle.cantidad}</span>
                  <span className="vdetalle-item-precio">
                    {formatoCOP(detalle.precioUnitario)}
                  </span>
                  <span className="vdetalle-item-subtotal">
                    {formatoCOP(detalle.precioUnitario * detalle.cantidad)}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <p className="vdetalle-vacio">
              No hay detalle de productos para esta venta.
            </p>
          )}
        </div>

        <div className="vdetalle-total">
          <span>Total</span>
          <strong>{formatoCOP(venta.monto)}</strong>
        </div>

        <button
          type="button"
          className="vdetalle-cerrar-btn"
          onClick={onCerrar}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DetalleVenta;