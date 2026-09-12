import { Search, Bell, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import FiltrosClientes from "../../../components/dashboardAdmin/ClientesAdmin/FiltrosClientes";
import TablaClientes from "../../../components/dashboardAdmin/ClientesAdmin/TablaClientes";
import NuevoClienteModal from "../../../components/dashboardAdmin/ClientesAdmin/NuevoClienteModal";

import clienteService, {
  type Cliente,
  type ClienteNuevo,
} from "../../../services/clientes.services";

import "./ClientesAdmin.css";

const ClientesAdmin = () => {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => {
  const cargarClientes = async () => {
    try {
      setCargando(true);
      setError("");

      const clientesObtenidos =
        await clienteService.obtenerClientes();

      setClientes(clientesObtenidos);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al cargar los clientes.");
      }
    } finally {
      setCargando(false);
    }
  };

  cargarClientes();
}, []);

  const registrarCliente = async (
    cliente: ClienteNuevo
  ) => {
    try {
      setCargando(true);
      setError("");

      await clienteService.crear(cliente);

      // Volver a consultar los clientes
      const clientesActualizados =
        await clienteService.obtenerClientes();

      setClientes(clientesActualizados);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al registrar el cliente.");
      }

      throw error;

    } finally {
      setCargando(false);
    }
  };

  return (
    <>
<div className="clientes-barra-superior">

          <p>
            <span className="clientes-orbix">
              Orbix
            </span>{" "}
            /{" "}
            <span className="clientes-admin">
              Admin
            </span>{" "}
            /{" "}
            <span className="clientes-titulo">
              Clientes
            </span>
          </p>

          <div className="clientes-acciones-superiores">

            <form className="clientes-buscar">
              <Search size={20} />

              <input
                type="text"
                placeholder="Buscar..."
              />
            </form>

            <div className="clientes-notifi">
              <Bell size={20} />
            </div>

            <div className="clientes-usuario">
              VO
            </div>

          </div>

        </div>

        <div className="clientes-encabezado">

          <div>
            <h2>Clientes</h2>

            <p className="clientes-fecha">
              {clientes.length} clientes
            </p>
          </div>

          <button
            className="clientes-button-agregar"
            onClick={() => {
              setError("");
              setMostrarModal(true);
            }}
          >
            <Plus size={20} />
            Nuevo cliente
          </button>

        </div>

        <FiltrosClientes
          filtro={filtro}
          setFiltro={setFiltro}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
        />

        <TablaClientes
          filtro={filtro}
          busqueda={busqueda}
        />

      </div>

      {/* MODAL */}

      <NuevoClienteModal
        abierto={mostrarModal}
        cerrar={() => setMostrarModal(false)}
        onRegistrar={registrarCliente}
        cargando={cargando}
        error={error}
      />

    </main>
  );
};
export default ClientesAdmin;
