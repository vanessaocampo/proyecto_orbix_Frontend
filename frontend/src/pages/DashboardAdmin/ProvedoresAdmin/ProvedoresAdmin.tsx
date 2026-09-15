import { Search, Bell, Plus } from "lucide-react";

import "./ProvedoresAdmin.css";

import FiltrosProvedor from "../../../components/dashboardAdmin/ProvedoresAdmin/FiltrosProvedor";
import { useState } from "react";
import TablaProvedor from "../../../components/dashboardAdmin/ProvedoresAdmin/TablaProvedor";
import CardsProvedor from "../../../components/dashboardAdmin/ProvedoresAdmin/CardsProvedor";
import ModelNuevoProvedor from "../../../components/dashboardAdmin/ProvedoresAdmin/ModelNuevoProvedor";

const ProvedoresAdmin = () => {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
{/* ENCABEZADO */}
        <div className="provedores-encabezado">
          <div>
            <h2>Proveedores</h2>

            <p className="provedores-fecha">8 proveedores registrados</p>
          </div>

          <button
            className="provedores-button-agregar"
            onClick={() => setMostrarModal(true)}
          >
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
      </div>

      <ModelNuevoProvedor
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
      />
    </main>
  );
};

export default ProvedoresAdmin;
