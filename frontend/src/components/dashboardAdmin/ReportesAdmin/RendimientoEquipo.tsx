import "./RendimientoEquipo.css";

interface Vendedor {
  iniciales: string;
  nombre: string;
  ventas: number;
  pedidos: number;
  conversion: number;
}

const vendedores: Vendedor[] = [
  {
    iniciales: "AT",
    nombre: "Ana Torres",
    ventas: 48600,
    pedidos: 38,
    conversion: 74,
  },
  {
    iniciales: "DR",
    nombre: "Diego Ruiz",
    ventas: 36200,
    pedidos: 29,
    conversion: 68,
  },
  {
    iniciales: "LH",
    nombre: "Luis Herrera",
    ventas: 52400,
    pedidos: 41,
    conversion: 71,
  },
];

const RendimientoEquipo = () => {
  return (
    <section className="rendimiento-equipo">
      {vendedores.map((vendedor) => (
        <div
          className="card-rendimiento"
          key={vendedor.nombre}
        >
          <div className="rendimiento-persona">
            <div className="rendimiento-avatar">
              {vendedor.iniciales}
            </div>

            <div className="rendimiento-nombre">
              <h3>{vendedor.nombre}</h3>
              <span>Vendedor</span>
            </div>
          </div>

          <div className="rendimiento-ventas">
            <span>VENTAS TOTALES</span>

            <strong>
              $ {vendedor.ventas.toLocaleString("es-CO")}
            </strong>
          </div>

          <div className="rendimiento-estadisticas">
            <div>
              <span>PEDIDOS</span>
              <strong>{vendedor.pedidos}</strong>
            </div>

            <div>
              <span>CONVERSIÓN</span>
              <strong className="conversion">
                {vendedor.conversion}%
              </strong>
            </div>
          </div>

          <div className="rendimiento-barra">
            <div
              className="rendimiento-barra-progreso"
              style={{
                width: `${vendedor.conversion}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default RendimientoEquipo;