import { X } from "lucide-react";
import { useState } from "react";

import "./TablaVentas.css";

import type { Venta } from "../../../services/ventas.services";

interface TablaVentasProps {
  filtro: string;
  busqueda: string;
  ventas: Venta[];
  cargando: boolean;
}

const TablaVentas = ({
  filtro,
  busqueda,
  ventas,
  cargando,
}: TablaVentasProps) => {
  const [ventaSeleccionada, setVentaSeleccionada] =
    useState<Venta | null>(null);

  const textoBusqueda = busqueda.toLowerCase().trim();

  const ventasFiltradas = ventas.filter((venta) => {
    const estado = venta.estado.replace("_", " ");

    const coincideEstado =
      filtro === "Todos" ||
      estado.toLowerCase() === filtro.toLowerCase();

    const coincideBusqueda =
      venta.codigoVenta?.toLowerCase().includes(textoBusqueda) ||
      venta.cliente.nombre.toLowerCase().includes(textoBusqueda) ||
      venta.usuario.nombre.toLowerCase().includes(textoBusqueda);

    return coincideEstado && coincideBusqueda;
  });

  const formatearEstado = (estado: string) => {
    const estados: Record<string, string> = {
      pendiente: "Pendiente",
      en_proceso: "En proceso",
      completada: "Completada",
      cancelada: "Cancelada",
      devuelta: "Devuelta",
    };

    return estados[estado] ?? estado;
  };

  const formatearMetodoPago = (metodoPago: string) => {
    const metodos: Record<string, string> = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta",
      transferencia: "Transferencia",
    };

    return metodos[metodoPago] ?? metodoPago;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (cargando) {
    return (
      <section className="tabla-ventas-wrapper">
        <div className="tabla-ventas-contenedor">
          <div className="ventas-sin-resultados">
            Cargando ventas...
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="tabla-ventas-wrapper">
        <div className="tabla-ventas-contenedor">
          <table className="tabla-ventas">
            <thead>
              <tr>
                <th>N° PEDIDO</th>
                <th>CLIENTE</th>
                <th>VENDEDOR</th>
                <th>ITEMS</th>
                <th>MONTO</th>
                <th>PAGO</th>
                <th>ESTADO</th>
                <th>FECHA</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {ventasFiltradas.map((venta) => (
                <tr key={venta.idVenta}>
                  <td className="pedido-venta">
                    {venta.codigoVenta ?? "Sin código"}
                  </td>

                  <td className="cliente-venta">
                    {venta.cliente.nombre}
                  </td>

                  <td className="vendedor-venta">
                    {venta.usuario.nombre}
                  </td>

                  <td className="items-venta">
                    {venta.detalles.length}
                  </td>

                  <td className="monto-venta">
                    $ {Number(venta.total).toLocaleString("es-CO")}
                  </td>

                  <td>
                    <span
                      className={
                        venta.metodoPago === "efectivo"
                          ? "pago-efectivo"
                          : "pago-transferencia"
                      }
                    >
                      {formatearMetodoPago(venta.metodoPago)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`estado-venta estado-${venta.estado.replace(
                        "_",
                        "-"
                      )}`}
                    >
                      {formatearEstado(venta.estado)}
                    </span>
                  </td>

                  <td className="fecha-venta">
                    {formatearFecha(venta.fecha)}
                  </td>

                  <td className="accion-venta">
                    <button
                      type="button"
                      className="boton-ver-venta"
                      onClick={() =>
                        setVentaSeleccionada(venta)
                      }
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}

              {ventasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="ventas-sin-resultados"
                  >
                    No se encontraron ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {ventaSeleccionada && (
        <div
          className="detalle-venta-overlay"
          onClick={() => setVentaSeleccionada(null)}
        >
          <div
            className="detalle-venta-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detalle-venta-header">
              <div>
                <span className="detalle-venta-etiqueta">
                  Detalle de venta
                </span>

                <h2>
                  {ventaSeleccionada.codigoVenta ??
                    "Sin código"}
                </h2>
              </div>

              <button
                type="button"
                className="detalle-venta-cerrar"
                onClick={() =>
                  setVentaSeleccionada(null)
                }
              >
                <X size={21} />
              </button>
            </div>

            <div className="detalle-venta-datos">
              <div className="detalle-venta-dato">
                <span>Cliente</span>
                <strong>
                  {ventaSeleccionada.cliente.nombre}
                </strong>
                <small>
                  Documento:{" "}
                  {ventaSeleccionada.cliente.documento}
                </small>
              </div>

              <div className="detalle-venta-dato">
                <span>Vendedor</span>
                <strong>
                  {ventaSeleccionada.usuario.nombre}
                </strong>
                <small>
                  {ventaSeleccionada.usuario.correo}
                </small>
              </div>

              <div className="detalle-venta-dato">
                <span>Fecha</span>
                <strong>
                  {formatearFecha(
                    ventaSeleccionada.fecha
                  )}
                </strong>
              </div>

              <div className="detalle-venta-dato">
                <span>Método de pago</span>
                <strong>
                  {formatearMetodoPago(
                    ventaSeleccionada.metodoPago
                  )}
                </strong>
              </div>
            </div>

            <div className="detalle-venta-productos">
              <div className="detalle-venta-productos-titulo">
                <span>Productos</span>
                <span>
                  {ventaSeleccionada.detalles.length}{" "}
                  producto(s)
                </span>
              </div>

              {ventaSeleccionada.detalles.map(
                (detalle, index) => (
                  <div
                    className="detalle-venta-producto"
                    key={`${detalle.idProducto}-${index}`}
                  >
                    <div>
                      <strong>
                        {detalle.producto.nombre}
                      </strong>

                      <span>
                        {detalle.cantidad} × ${" "}
                        {Number(
                          detalle.precioUnitario
                        ).toLocaleString("es-CO")}
                      </span>
                    </div>

                    <strong>
                      ${" "}
                      {Number(
                        detalle.subtotal
                      ).toLocaleString("es-CO")}
                    </strong>
                  </div>
                )
              )}
            </div>

            <div className="detalle-venta-resumen">
              <div>
                <span>Estado</span>

                <strong
                  className={`detalle-estado estado-${ventaSeleccionada.estado.replace(
                    "_",
                    "-"
                  )}`}
                >
                  {formatearEstado(
                    ventaSeleccionada.estado
                  )}
                </strong>
              </div>

              <div className="detalle-venta-total">
                <span>Total</span>

                <strong>
                  ${" "}
                  {Number(
                    ventaSeleccionada.total
                  ).toLocaleString("es-CO")}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="detalle-venta-boton"
              onClick={() =>
                setVentaSeleccionada(null)
              }
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TablaVentas;