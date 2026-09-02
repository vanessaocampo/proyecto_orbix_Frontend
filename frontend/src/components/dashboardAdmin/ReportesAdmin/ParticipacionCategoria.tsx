import "./ParticipacionCategoria.css";

const datosCategorias = [
  {
    categoria: "Electrónica",
    porcentaje: 38,
    color: "#0F829F",
  },
  {
    categoria: "Ropa y calzado",
    porcentaje: 24,
    color: "#F59E0B",
  },
  {
    categoria: "Alimentos",
    porcentaje: 18,
    color: "#10B981",
  },
  {
    categoria: "Hogar",
    porcentaje: 12,
    color: "#8B5CF6",
  },
  {
    categoria: "Otros",
    porcentaje: 8,
    color: "#94A3B8",
  },
];

const ParticipacionCategoria = () => {
  return (
    <section className="participacion-categoria">

      <div className="participacion-categoria-titulo">
        <h3>Participación por categoría</h3>

        <p>Distribución del volumen de ventas</p>
      </div>

      <div className="participacion-categoria-lista">
        {datosCategorias.map((categoria) => (
          <div
            className="participacion-categoria-item"
            key={categoria.categoria}
          >

            <div className="participacion-categoria-info">
              <span className="participacion-categoria-nombre">
                {categoria.categoria}
              </span>

              <span className="participacion-categoria-porcentaje">
                {categoria.porcentaje}%
              </span>
            </div>

            <div className="participacion-categoria-barra-fondo">
              <div
                className="participacion-categoria-barra"
                style={{
                  width: `${categoria.porcentaje}%`,
                  backgroundColor: categoria.color,
                }}
              />
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};

export default ParticipacionCategoria;