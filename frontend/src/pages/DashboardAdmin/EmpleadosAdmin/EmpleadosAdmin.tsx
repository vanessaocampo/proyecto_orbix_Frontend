import { useState } from "react";
import { Bell, Plus, Search } from "lucide-react";

import Sidebar from "../../../components/dashboardAdmin/Sidebar";

import "./EmpleadosAdmin.css";

import CardsEmpleados from "../../../components/dashboardAdmin/EmpleadosAdmin/CardsEmpleados";
import FiltrosEmpleados from "../../../components/dashboardAdmin/EmpleadosAdmin/FiltrosEmpleados";
import TablaEmpleados from "../../../components/dashboardAdmin/EmpleadosAdmin/TablaEmpleados";

const EmpleadosAdmin = () => {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  return (
    <main className="empleados-main">
      <Sidebar />

      <div className="empleados-contenido">

        {/* BARRA SUPERIOR */}
        <div className="empleados-barra-superior">
          <p>
            <span className="empleados-orbix">Orbix</span> /{" "}
            <span className="empleados-admin">Admin</span> /{" "}
            <span className="empleados-titulo">Empleados</span>
          </p>

          <div className="empleados-acciones-superiores">
            <form className="empleados-buscar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar..."
              />
            </form>

            <div className="empleados-notifi">
              <Bell size={20} />
            </div>

            <div className="empleados-usuario">
              VO
            </div>
          </div>
        </div>

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

      </div>
    </main>
  );
};

export default EmpleadosAdmin;