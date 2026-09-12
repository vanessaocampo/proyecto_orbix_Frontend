import { Search } from "lucide-react";
import "./FiltrosVentas.css";

interface FiltrosVentasProps {
  filtro: string;
  setFiltro: (filtro: string) => void;
  busqueda: string;
  setBusqueda: (busqueda: string) => void;
  totalResultados: number;
  totalConfirmado: number;
}

const FiltrosVentas = ({
  filtro,
  setFiltro,
  busqueda,
  setBusqueda,
  totalResultados,
  totalConfirmado,
}: FiltrosVentasProps) => {
  const filtros = [
    "Todos",
    "Completada",
    "En proceso",
    "Pendiente",
    "Cancelada",
  ];

  return (
    <section className="filtros-ventas">
      <div className="filtros-ventas-contenido">
        <form
          className="buscar-ventas"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search size={21} />

          <input
            type="text"
            placeholder="Buscar por pedido o cliente"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </form>

        <div className="botones-filtros-ventas">
          {filtros.map((nombreFiltro) => (
            <button
              type="button"
              key={nombreFiltro}
              className={
                filtro === nombreFiltro
                  ? "filtro-venta-activo"
                  : ""
              }
              onClick={() => setFiltro(nombreFiltro)}
            >
              {nombreFiltro}
            </button>
          ))}
        </div>
      </div>

      <p className="ventas-resultados">
        {totalResultados} resultados · ${" "}
        {totalConfirmado.toLocaleString("es-CO")} confirmado
      </p>
    </section>
  );
};

export default FiltrosVentas;