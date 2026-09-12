import { Search } from "lucide-react";
import "./FiltrosClientes.css";

interface FiltrosClientesProps {
  filtro: string;
  setFiltro: (filtro: string) => void;
  busqueda: string;
  setBusqueda: (busqueda: string) => void;
}

const FiltrosClientes = ({
  filtro,
  setFiltro,
  busqueda,
  setBusqueda,
}: FiltrosClientesProps) => {
  const filtros = [
    "Todos",
    "Nuevo",
    "Minorista",
    "Mayorista",
    "Frecuente",
  ];

  return (
    <section className="filtros-clientes">
      <div className="filtros-clientes-contenido">

        <form
          action=""
          className="buscar-clientes"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search size={21} />

          <input
            type="text"
            placeholder="Buscar cliente, contacto o ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </form>

        <div className="botones-filtros-clientes">
          {filtros.map((nombreFiltro) => (
            <button
              type="button"
              key={nombreFiltro}
              className={
                filtro === nombreFiltro
                  ? "filtro-cliente-activo"
                  : ""
              }
              onClick={() => setFiltro(nombreFiltro)}
            >
              {nombreFiltro}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FiltrosClientes;