import "./MetricCards.css";

type Metrica = {
  titulo: string;
  valor: string;
  detalle: string;
  colorDetalle: "purple" | "green" | "blue" | "orange";
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

const MetricCards = () => {
  return (
    <div className="vmetric-cards">
      {METRICAS.map((metrica) => (
        <div className="vmetric-card" key={metrica.titulo}>
          <p className="vmetric-titulo">{metrica.titulo}</p>
          <h2 className="vmetric-valor">{metrica.valor}</h2>
          <p className={`vmetric-detalle ${metrica.colorDetalle}`}>
            {metrica.detalle}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;