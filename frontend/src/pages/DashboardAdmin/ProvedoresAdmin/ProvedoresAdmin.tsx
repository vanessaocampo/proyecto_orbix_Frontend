import { Search, Bell, Plus } from "lucide-react";

import "./ProvedoresAdmin.css";

import FiltrosProvedor from "../../../components/dashboardAdmin/ProvedoresAdmin/FiltrosProvedor";
import { useState } from "react";
import TablaProvedor from "../../../components/dashboardAdmin/ProvedoresAdmin/TablaProvedor";
import CardsProvedor from "../../../components/dashboardAdmin/ProvedoresAdmin/CardsProvedor";

const ProvedoresAdmin = () => {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  return (
    <>
{/* ENCABEZADO */}
        <div className="provedores-encabezado">
          <div>
            <h2>Proveedores</h2>

            <p className="provedores-fecha">8 proveedores registrados</p>
          </div>

          <button className="provedores-button-agregar">
            <Plus size={20} />
            Nuevo proveedor
          </button>
        </div>
        <CardsProvedor />

        <FiltrosProvedor
          filtro={filtro}
          setFiltro={setFiltro}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
        />
        <TablaProvedor filtro={filtro} busqueda={busqueda} />
      </>
);
};

export default ProvedoresAdmin;
