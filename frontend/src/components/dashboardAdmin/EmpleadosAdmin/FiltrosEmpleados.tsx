import { Search } from "lucide-react";
import "./FiltrosEmpleados.css";

interface FiltrosEmpleadosProps {
  busqueda: string;
  filtro: string;
  onBusquedaChange: (valor: string) => void;
  onFiltroChange: (valor: string) => void;
}

const FiltrosEmpleados = ({
  busqueda,
  filtro,
  onBusquedaChange,
  onFiltroChange,
}: FiltrosEmpleadosProps) => {
  return (
    <section className="filtros-empleados">
      <div className="busqueda-empleados">
        <Search size={18} />

        <input
          type="text"
          placeholder="Buscar por nombre, email o ciudad..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
        />
      </div>

      <div className="botones-filtro-empleados">
        <button
          className={filtro === "Todos" ? "filtro-activo" : ""}
          onClick={() => onFiltroChange("Todos")}
        >
          Todos
        </button>

        <button
          className={filtro === "Vendedor" ? "filtro-activo" : ""}
          onClick={() => onFiltroChange("Vendedor")}
        >
          Vendedor
        </button>

        <button
          className={filtro === "Inventario" ? "filtro-activo" : ""}
          onClick={() => onFiltroChange("Inventario")}
        >
          Inventario
        </button>
      </div>
    </section>
  );
};

export default FiltrosEmpleados;
