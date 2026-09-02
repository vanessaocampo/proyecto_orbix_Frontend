import { Receipt, UserPlus } from "lucide-react";
import { actividadRecienteVendedor } from "../../data/mockDataVendedor";
import "./ActividadReciente.css";

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ActividadReciente = () => {
  return (
    <section className="vactividad-card">
      <div className="vactividad-header">
        <h3>Actividad reciente</h3>
      </div>

      <div className="vactividad-lista">
        {actividadRecienteVendedor.map((actividad, index) => {
          const esCliente = actividad.monto === null;
          const Icono = esCliente ? UserPlus : Receipt;

          return (
            <div
              className="vactividad-item"
              key={index}
              style={{
                borderBottom:
                  index < actividadRecienteVendedor.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              <div
                className={`vactividad-icono ${
                  esCliente ? "vactividad-icono-cliente" : "vactividad-icono-venta"
                }`}
              >
                <Icono size={14} />
              </div>

              <div className="vactividad-info">
                <strong>{actividad.accion}</strong>
                <span>{actividad.cliente}</span>
              </div>

              <div className="vactividad-datos">
                {actividad.monto !== null && (
                  <strong>{formatoCOP(actividad.monto)}</strong>
                )}
                <span>{actividad.hora}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ActividadReciente;