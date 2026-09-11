import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ventasService, {
  type Venta,
} from "../../services/ventas.services";
import "./UltimasVentas.css";

const UltimasVentas = () => {
  const navigate = useNavigate();

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUltimasVentas = async () => {
      try {
        setCargando(true);

        const todasLasVentas = await ventasService.obtenerVentas();

        // Ordenamos de la más reciente a la más antigua
        const ultimasVentas = [...todasLasVentas]
          .sort(
            (a, b) =>
              new Date(b.fecha).getTime() -
              new Date(a.fecha).getTime()
          )
          .slice(0, 5);

        setVentas(ultimasVentas);
      } catch (error) {
        console.error(
          "Error al cargar las últimas ventas:",
          error
        );
      } finally {
        setCargando(false);
      }
    };

    cargarUltimasVentas();
  }, []);

  const formatearMonto = (monto: number | string) => {
    return `$ ${Number(monto).toLocaleString("es-CO")}`;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const obtenerClaseEstado = (estado: string) => {
    const estadoNormalizado = estado.toLowerCase();

    if (estadoNormalizado === "completada") {
      return "estado-completada";
    }

    if (estadoNormalizado === "en proceso") {
      return "estado-proceso";
    }

    if (estadoNormalizado === "pendiente") {
      return "estado-pendiente";
    }

    if (estadoNormalizado === "cancelada") {
      return "estado-cancelada";
    }

    return "estado-default";
  };

  return (
    <section className="ultimas-ventas">

      <div className="ultimas-ventas-header">
        <h3>Últimas ventas</h3>

        <button
          className="ver-todas"
          onClick={() => navigate("/dashboard/admin/ventas")}
        >
          Ver todas →
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>PEDIDO</th>
            <th>CLIENTE</th>
            <th>PRODUCTO</th>
            <th>MONTO</th>
            <th>ESTADO</th>
            <th>FECHA</th>
          </tr>
        </thead>

        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={6} className="mensaje-tabla">
                Cargando ventas...
              </td>
            </tr>
          ) : ventas.length === 0 ? (
            <tr>
              <td colSpan={6} className="mensaje-tabla">
                No hay ventas registradas.
              </td>
            </tr>
          ) : (
            ventas.map((venta) => (
              <tr key={venta.idVenta}>

                <td>{venta.codigoVenta}</td>

                <td>
                  {venta.cliente?.nombre || "Sin cliente"}
                </td>

                <td>
                  {venta.detalles?.[0]?.producto?.nombre ||
                    "Sin producto"}
                </td>

                <td>
                  {formatearMonto(venta.total)}
                </td>

                <td>
                  <span
                    className={`estado ${obtenerClaseEstado(
                      venta.estado
                    )}`}
                  >
                    {venta.estado}
                  </span>
                </td>

                <td>
                  {formatearFecha(venta.fecha)}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};

export default UltimasVentas;