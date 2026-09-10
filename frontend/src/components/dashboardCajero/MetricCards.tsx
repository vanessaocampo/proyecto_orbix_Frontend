import "./MetricCards.css";

export type Metrica = {
  titulo: string;
  valor: string;
  detalle: string;
  colorDetalle: "purple" | "green" | "blue" | "orange";
  onClick?: () => void;
};

const METRICAS: Metrica[] = [
  {
    titulo: "Mis ventas del mes",
    valor: "$ 19.800",
    detalle: "79% de la meta",
    colorDetalle: "purple",
  },
  {
    titulo: "Ventas de hoy",
    valor: "$ 9.700",
    detalle: "3 órdenes confirmadas",
    colorDetalle: "green",
  },
  {
    titulo: "Mis clientes",
    valor: "34",
    detalle: "+2 nuevos este mes",
    colorDetalle: "blue",
  },
  {
    titulo: "Ticket promedio",
    valor: "$ 3.233",
    detalle: "últimas 10 ventas",
    colorDetalle: "orange",
  },
];

type MetricCardsProps = {
  metricas?: Metrica[];
};

const MetricCards = ({ metricas = METRICAS }: MetricCardsProps) => {
  return (
    <div className="vmetric-cards">
      {metricas.map((metrica) => {
        const contenido = (
          <>
            <p className="vmetric-titulo">{metrica.titulo}</p>
            <h2 className="vmetric-valor">{metrica.valor}</h2>
            <p className={`vmetric-detalle ${metrica.colorDetalle}`}>
              {metrica.detalle}
            </p>
          </>
        );

        return metrica.onClick ? (
          <button
            type="button"
            className="vmetric-card vmetric-card-boton"
            key={metrica.titulo}
            onClick={metrica.onClick}
          >
            {contenido}
          </button>
        ) : (
          <div className="vmetric-card" key={metrica.titulo}>
            {contenido}
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;