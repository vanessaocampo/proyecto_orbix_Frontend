import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";

import "./EmpleadosAdmin.css";

import CardsEmpleados from "../../../components/dashboardAdmin/EmpleadosAdmin/CardsEmpleados";
import FiltrosEmpleados from "../../../components/dashboardAdmin/EmpleadosAdmin/FiltrosEmpleados";
import TablaEmpleados from "../../../components/dashboardAdmin/EmpleadosAdmin/TablaEmpleados";

const EmpleadosAdmin = () => {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  return (
    <>
{/* ENCABEZADO */}
        <div className="empleados-encabezado">
          <div>
            <h2>Empleados</h2>

            <p className="empleados-fecha">
              5 empleados registrados · 4 activos
            </p>
          </div>

          <button className="empleados-button-agregar">
            <Plus size={20} />
            Agregar empleado
          </button>
        </div>

        {/* CARDS */}
        <CardsEmpleados />

        {/* FILTROS */}
        <FiltrosEmpleados
          busqueda={busqueda}
          filtro={filtro}
          onBusquedaChange={setBusqueda}
          onFiltroChange={setFiltro}
        />

        {/* TABLA */}
        <TablaEmpleados
          busqueda={busqueda}
          filtro={filtro}
        />

      </>
);
};

export default EmpleadosAdmin;