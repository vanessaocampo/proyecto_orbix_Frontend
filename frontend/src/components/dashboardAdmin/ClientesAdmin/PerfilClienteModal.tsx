import "./PerfilClienteModal.css";
import type { Cliente } from "../../../services/clientes.services";
import type { Venta } from "../../../services/ventas.services";

interface PerfilClienteModalProps {
  cliente: Cliente;
  totalCompras: number;
  cantidadPedidos: number;
  ultimoPedido: Venta | null;
  onCerrar: () => void;
}

const PerfilClienteModal = ({
  cliente,
  totalCompras,
  cantidadPedidos,
  ultimoPedido,
  onCerrar,
}: PerfilClienteModalProps) => {
  const obtenerSegmento = (segmento?: string) => {
    if (!segmento) return "Nuevo";

    return (
      segmento.charAt(0).toUpperCase() +
      segmento.slice(1).toLowerCase()
    );
  };

  const formatearDinero = (valor: number) => {
    return `$ ${valor.toLocaleString("es-CO")}`;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const obtenerIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .slice(0, 2)
      .map((parte) => parte[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className="modal-cliente-overlay"
      onClick={onCerrar}
    >
      <div
        className="modal-cliente"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ENCABEZADO */}
        <div className="modal-cliente-header">
          <div>
            <span className="modal-cliente-etiqueta">
              Perfil del cliente
            </span>

            <h2>{cliente.nombre}</h2>

            <p>
              Información y resumen del cliente
            </p>
          </div>

          <button
            type="button"
            className="modal-cliente-cerrar"
            onClick={onCerrar}
          >
            ×
          </button>
        </div>

        {/* INFORMACIÓN PRINCIPAL */}
        <div className="modal-cliente-principal">
          <div className="modal-cliente-avatar">
            {obtenerIniciales(cliente.nombre)}
          </div>

          <div className="modal-cliente-identidad">
            <h3>{cliente.nombre}</h3>

            <span>
              {cliente.codigoCliente || cliente.documento}
            </span>
          </div>

          <span
            className={`modal-segmento modal-segmento-${
              cliente.segmento?.toLowerCase() || "nuevo"
            }`}
          >
            {obtenerSegmento(cliente.segmento)}
          </span>
        </div>

        {/* INFORMACIÓN DEL CLIENTE */}
        <div className="modal-cliente-seccion">
          <div className="modal-seccion-titulo">
            <h4>Información del cliente</h4>
          </div>

          <div className="modal-cliente-grid">
            <div className="modal-dato">
              <span>Documento</span>
              <strong>{cliente.documento}</strong>
            </div>

            <div className="modal-dato">
              <span>Teléfono</span>
              <strong>
                {cliente.telefono || "Sin teléfono"}
              </strong>
            </div>

            <div className="modal-dato">
              <span>Correo electrónico</span>
              <strong>
                {cliente.correo || "Sin correo"}
              </strong>
            </div>

            <div className="modal-dato">
              <span>Dirección</span>
              <strong>
                {cliente.direccion || "Sin dirección"}
              </strong>
            </div>

            <div className="modal-dato">
              <span>Ciudad</span>
              <strong>
                {cliente.ciudad || "Sin ciudad"}
              </strong>
            </div>

            <div className="modal-dato">
              <span>Segmento</span>
              <strong>
                {obtenerSegmento(cliente.segmento)}
              </strong>
            </div>
          </div>
        </div>

        {/* RESUMEN DE COMPRAS */}
        <div className="modal-cliente-seccion">
          <div className="modal-seccion-titulo">
            <h4>Resumen de compras</h4>
          </div>

          <div className="modal-resumen">
            <div className="modal-resumen-item">
              <span>Total de compras</span>

              <strong className="modal-resumen-total">
                {formatearDinero(totalCompras)}
              </strong>
            </div>

            <div className="modal-resumen-item">
              <span>Cantidad de pedidos</span>

              <strong>
                {cantidadPedidos}
              </strong>
            </div>

            <div className="modal-resumen-item">
              <span>Último pedido</span>

              <strong>
                {ultimoPedido
                  ? formatearFecha(ultimoPedido.fecha)
                  : "Sin pedidos"}
              </strong>
            </div>
          </div>
        </div>

        {/* ÚLTIMO PEDIDO */}
        {ultimoPedido && (
          <div className="modal-cliente-seccion modal-ultimo-pedido">
            <div className="modal-seccion-titulo">
              <h4>Último pedido</h4>

              <span>
                {ultimoPedido.codigoVenta}
              </span>
            </div>

            <div className="modal-pedido-contenido">
              <div>
                <span>Fecha</span>

                <strong>
                  {formatearFecha(ultimoPedido.fecha)}
                </strong>
              </div>

              <div>
                <span>Método de pago</span>

                <strong>
                  {ultimoPedido.metodoPago}
                </strong>
              </div>

              <div>
                <span>Estado</span>

                <strong className="modal-estado">
                  {ultimoPedido.estado}
                </strong>
              </div>

              <div>
                <span>Total</span>

                <strong className="modal-pedido-total">
                  {formatearDinero(
                    Number(ultimoPedido.total)
                  )}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* PIE */}
        <div className="modal-cliente-footer">
          <button
            type="button"
            className="modal-boton-cerrar"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilClienteModal;