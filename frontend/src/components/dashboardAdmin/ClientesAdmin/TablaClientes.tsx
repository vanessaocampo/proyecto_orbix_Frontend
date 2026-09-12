import { useEffect, useState } from "react";
import "./TablaClientes.css";

import clienteService, {
  type Cliente,
} from "../../../services/clientes.services";

import ventasService, {
  type Venta,
} from "../../../services/ventas.services";

import PerfilClienteModal from "./PerfilClienteModal";

interface TablaClientesProps {
  filtro: string;
  busqueda: string;
}

const TablaClientes = ({
  filtro,
  busqueda,
}: TablaClientesProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError("");

        const [datosClientes, datosVentas] = await Promise.all([
          clienteService.obtenerClientes(),
          ventasService.obtenerVentas(),
        ]);

        setClientes(datosClientes);
        setVentas(datosVentas);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error al cargar los clientes.");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const textoBusqueda = busqueda
    .toLocaleLowerCase()
    .trim();

  const clientesFiltrados = clientes.filter((cliente) => {
    const coincideSegmento =
      filtro === "Todos" ||
      cliente.segmento?.toLowerCase() === filtro.toLowerCase();

    const coincideBusqueda =
      cliente.nombre
        .toLocaleLowerCase()
        .includes(textoBusqueda) ||
      cliente.documento
        .toLocaleLowerCase()
        .includes(textoBusqueda) ||
      cliente.codigoCliente
        ?.toLocaleLowerCase()
        .includes(textoBusqueda) ||
      cliente.ciudad
        ?.toLocaleLowerCase()
        .includes(textoBusqueda) ||
      cliente.correo
        ?.toLocaleLowerCase()
        .includes(textoBusqueda);

    return coincideSegmento && coincideBusqueda;
  });

  const obtenerIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .slice(0, 2)
      .map((parte) => parte[0])
      .join("")
      .toUpperCase();
  };

  const obtenerSegmento = (segmento?: string) => {
    if (!segmento) return "Nuevo";

    return (
      segmento.charAt(0).toUpperCase() +
      segmento.slice(1).toLowerCase()
    );
  };

  // --------------------------------
  // VENTAS DEL CLIENTE
  // --------------------------------

  const obtenerVentasCliente = (idCliente: string) => {
    return ventas.filter(
      (venta) =>
        venta.cliente.idCliente === idCliente
    );
  };

  // --------------------------------
  // TOTAL COMPRAS
  // --------------------------------

  const obtenerTotalCompras = (idCliente: string) => {
    const ventasCliente =
      obtenerVentasCliente(idCliente);

    return ventasCliente.reduce(
      (total, venta) => {
        return total + Number(venta.total);
      },
      0
    );
  };

  // --------------------------------
  // CANTIDAD DE PEDIDOS
  // --------------------------------

  const obtenerCantidadPedidos = (
    idCliente: string
  ) => {
    return obtenerVentasCliente(idCliente).length;
  };

  // --------------------------------
  // ÚLTIMO PEDIDO
  // --------------------------------

  const obtenerUltimoPedido = (
    idCliente: string
  ) => {
    const ventasCliente =
      obtenerVentasCliente(idCliente);

    if (ventasCliente.length === 0) {
      return null;
    }

    return ventasCliente.reduce(
      (ultimaVenta, venta) => {
        return new Date(venta.fecha).getTime() >
          new Date(ultimaVenta.fecha).getTime()
          ? venta
          : ultimaVenta;
      }
    );
  };

  // --------------------------------
  // FORMATEAR DINERO
  // --------------------------------

  const formatearDinero = (valor: number) => {
    return valor.toLocaleString("es-CO");
  };

  // --------------------------------
  // FORMATEAR FECHA
  // --------------------------------

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString(
      "es-CO",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // --------------------------------
  // CARGANDO
  // --------------------------------

  if (cargando) {
    return (
      <section className="tabla-clientes-wrapper">
        <div className="tabla-clientes-contenedor">
          <div className="clientes-cargando">
            Cargando clientes...
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <section className="tabla-clientes-wrapper">
        <div className="tabla-clientes-contenedor">
          <div className="clientes-error">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tabla-clientes-wrapper">
      <div className="tabla-clientes-contenedor">
        <table className="tabla-clientes">
          <thead>
            <tr>
              <th>CLIENTE</th>
              <th>CONTACTO</th>
              <th>CIUDAD</th>
              <th>TOTAL COMPRAS</th>
              <th>PEDIDOS</th>
              <th>ÚLTIMO PEDIDO</th>
              <th>SEGMENTO</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => {
              const iniciales =
                obtenerIniciales(
                  cliente.nombre
                );

              const totalCompras =
                obtenerTotalCompras(
                  cliente.idCliente
                );

              const cantidadPedidos =
                obtenerCantidadPedidos(
                  cliente.idCliente
                );

              const ultimoPedido =
                obtenerUltimoPedido(
                  cliente.idCliente
                );

              return (
                <tr
                  key={cliente.idCliente}
                >
                  {/* CLIENTE */}
                  <td className="cliente-info">
                    <div className="cliente-contenido">
                      <div className="cliente-avatar">
                        {iniciales}
                      </div>

                      <div className="cliente-datos">
                        <span className="cliente-nombre">
                          {cliente.nombre}
                        </span>

                        <span className="cliente-id">
                          {cliente.codigoCliente ||
                            cliente.documento}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* CONTACTO */}
                  <td className="contacto-info">
                    <div className="contacto-datos">
                      <span className="contacto-nombre">
                        {cliente.telefono ||
                          "Sin teléfono"}
                      </span>

                      <span className="contacto-correo">
                        {cliente.correo ||
                          "Sin correo"}
                      </span>
                    </div>
                  </td>

                  {/* CIUDAD */}
                  <td className="ciudad-info">
                    {cliente.ciudad ||
                      "Sin ciudad"}
                  </td>

                  {/* TOTAL COMPRAS */}
                  <td className="compras-info">
                    $ {formatearDinero(totalCompras)}
                  </td>

                  {/* PEDIDOS */}
                  <td className="pedidos-info">
                    {cantidadPedidos}
                  </td>

                  {/* ÚLTIMO PEDIDO */}
                  <td className="ultimo-pedido-info">
                    {ultimoPedido
                      ? formatearFecha(
                          ultimoPedido.fecha
                        )
                      : "Sin pedidos"}
                  </td>

                  {/* SEGMENTO */}
                  <td className="segmento-info">
                    <span
                      className={`segmento-${
                        cliente.segmento?.toLowerCase() ||
                        "nuevo"
                      }`}
                    >
                      {obtenerSegmento(
                        cliente.segmento
                      )}
                    </span>
                  </td>

                  {/* PERFIL */}
                  <td className="perfil-info">
                    <button
                      type="button"
                      className="boton-ver-perfil"
                      onClick={() =>
                        setClienteSeleccionado(cliente)
                      }
                    >
                      Ver perfil
                    </button>
                  </td>
                </tr>
              );
            })}

            {clientesFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="clientes-sin-resultados"
                >
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PERFIL DEL CLIENTE */}
      {clienteSeleccionado && (
        <PerfilClienteModal
          cliente={clienteSeleccionado}
          totalCompras={obtenerTotalCompras(
            clienteSeleccionado.idCliente
          )}
          cantidadPedidos={obtenerCantidadPedidos(
            clienteSeleccionado.idCliente
          )}
          ultimoPedido={obtenerUltimoPedido(
            clienteSeleccionado.idCliente
          )}
          onCerrar={() =>
            setClienteSeleccionado(null)
          }
        />
      )}
    </section>
  );
};

export default TablaClientes;