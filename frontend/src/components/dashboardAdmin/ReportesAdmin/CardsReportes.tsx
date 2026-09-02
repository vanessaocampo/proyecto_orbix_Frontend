import {
  FileChartColumn,
  Package,
  UsersRound,
  CircleDollarSign,
  ArrowRight,
} from "lucide-react";
import "./CardsReportes.css";
const CardsReportes = () => {
  return (
    <section className="cards-reportes">
      <div className="card-reporte">
        <div className="card-reporte-titulo">
          <FileChartColumn color="#0EA5E9" size={36}/>
          <h4>Reporte de Venta</h4>
        </div>

        <span className="card-reporte-subtitulo-azul">
          Análisis completo de órdenes y facturación{" "}
        </span>
        <button className="report-button-azul">
          Generar reporte
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="card-reporte">
        <div className="card-reporte-titulo">
          <Package color="#A16207" size={40} />
          <h4>Reporte de Inventario</h4>
        </div>

        <span className="card-reporte-subtitulo-marron">
          estado de stock y movimientos de productos
        </span>
        <button className="report-button-marron">
          Generar reporte
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="card-reporte">
        <div className="card-reporte-titulo">
          <UsersRound color="purple" size={36}/>
          <h4>Reportes de Clientes</h4>
        </div>

        <span className="card-reporte-subtitulo-morado">
          Comportamiento y segmentación de clientes
        </span>
        <button className="report-button-morado">
          Generar reporte
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="card-reporte">
        <div className="card-reporte-titulo">
          <CircleDollarSign color="#F59E0B" size={36} />
          <h4>Reporte Financiero</h4>
        </div>

        <span className="card-reporte-subtitulo-amarillo">
          Ingresos, costos y margen de ganancia
        </span>
        <button className="report-button-amarillo">
          Generar reporte
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};
export default CardsReportes;
