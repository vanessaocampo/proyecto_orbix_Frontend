import "./MetaMensual.css";

const META = {
  mesTexto: "Julio 2026",
  actual: 19800,
  objetivo: 25000,
};

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const MetaMensual = () => {
  const porcentaje = Math.min(100, Math.round((META.actual / META.objetivo) * 100));

  return (
    <div className="vmeta-mensual">
      <div className="vmeta-mensual-header">
        <div>
          <h3>Meta mensual</h3>
          <p className="vmeta-mensual-sub">
            {META.mesTexto} · {formatoCOP(META.actual)} de {formatoCOP(META.objetivo)}
          </p>
        </div>
        <span className={`vmeta-porcentaje ${porcentaje >= 100 ? "completada" : ""}`}>
          {porcentaje}%
        </span>
      </div>

      <div className="vmeta-barra-track">
        <div className="vmeta-barra-fill" style={{ width: `${porcentaje}%` }} />
      </div>

      <div className="vmeta-rango">
        <span>$0</span>
        <span>{formatoCOP(META.objetivo)}</span>
      </div>
    </div>
  );
};

export default MetaMensual;