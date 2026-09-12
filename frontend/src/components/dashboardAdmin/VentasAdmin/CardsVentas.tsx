import "./CardsVentas.css";
import type { Venta } from "../../../services/ventas.services";

interface CardsVentasProps {
  ventas: Venta[];
}

const CardsVentas = ({ ventas }: CardsVentasProps) => {
  const calcularTotal = (estado: string) => {
    return ventas
      .filter((venta) => venta.estado === estado)
      .reduce(
        (total, venta) => total + Number(venta.total),
        0,
      );
  };

  const totalConfirmado = calcularTotal("completada");
  const totalEnProceso = calcularTotal("en_proceso");
  const totalPendiente = calcularTotal("pendiente");
  const totalCancelado = calcularTotal("cancelada");

  return (
    <section className="cards-ventas">
      <div className="card-venta">
        <div className="card-venta-titulo">
          <span className="punto-verde"></span>
          <span>Total confirmado</span>
        </div>

        <h3>
          $ {totalConfirmado.toLocaleString("es-CO")}
        </h3>
      </div>

      <div className="card-venta">
        <div className="card-venta-titulo">
          <span className="punto-azul"></span>
          <span>En proceso</span>
        </div>

        <h3>
          $ {totalEnProceso.toLocaleString("es-CO")}
        </h3>
      </div>

      <div className="card-venta">
        <div className="card-venta-titulo">
          <span className="punto-naranja"></span>
          <span>Pendiente</span>
        </div>

        <h3>
          $ {totalPendiente.toLocaleString("es-CO")}
        </h3>
      </div>

      <div className="card-venta">
        <div className="card-venta-titulo">
          <span className="punto-rojo"></span>
          <span>Cancelado</span>
        </div>

        <h3>
          $ {totalCancelado.toLocaleString("es-CO")}
        </h3>
      </div>
    </section>
  );
};

export default CardsVentas;