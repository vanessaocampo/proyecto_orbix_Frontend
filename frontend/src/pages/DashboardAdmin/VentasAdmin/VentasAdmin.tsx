import { Search, Bell, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import Sidebar from "../../../components/dashboardAdmin/Sidebar";
import "./VentasAdmin.css";

import CardsVentas from "../../../components/dashboardAdmin/VentasAdmin/CardsVentas";
import FiltrosVentas from "../../../components/dashboardAdmin/VentasAdmin/FiltrosVentas";
import TablaVentas from "../../../components/dashboardAdmin/VentasAdmin/TablaVentas";
import NuevaVenta from "../../../components/dashboardAdmin/VentasAdmin/NuevaVenta";

import ventasService, {
  type Venta,
} from "../../../services/ventas.services";

const VentasAdmin = () => {
  const [mostrarNuevaVenta, setMostrarNuevaVenta] = useState(false);

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargandoVentas, setCargandoVentas] = useState(true);

  // =========================
  // CARGAR VENTAS
  // =========================

  const cargarVentas = async () => {
    try {
      setCargandoVentas(true);

      const ventasObtenidas =
        await ventasService.obtenerVentas();

      setVentas(ventasObtenidas);
    } catch (error) {
      console.error(
        "Error al cargar ventas:",
        error
      );
    } finally {
      setCargandoVentas(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  // =========================
  // ABRIR NUEVA VENTA
  // =========================

  const abrirNuevaVenta = () => {
    setMostrarNuevaVenta(true);
  };

  // =========================
  // CERRAR NUEVA VENTA
  // =========================

  const cerrarNuevaVenta = () => {
    setMostrarNuevaVenta(false);
  };

  // =========================
  // VENTA CREADA
  // =========================

  const manejarVentaCreada = async () => {
    await cargarVentas();
  };

  return (
    <main className="ventas-main">

      <Sidebar />

      <div className="ventas-contenido">

        {/* =========================
            BARRA SUPERIOR
        ========================= */}

        <div className="ventas-barra-superior">

          <p>
            <span className="ventas-orbix">
              Orbix
            </span>{" "}
            /{" "}
            <span className="ventas-admin">
              Admin
            </span>{" "}
            /{" "}
            <span className="ventas-titulo">
              Ventas
            </span>
          </p>

          <div className="ventas-acciones-superiores">

            <form
              className="ventas-buscar"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search size={20} />

              <input
                type="text"
                placeholder="Buscar..."
              />
            </form>

            <div className="ventas-notifi">
              <Bell size={20} />
            </div>

            <div className="ventas-usuario">
              VO
            </div>

          </div>

        </div>

        {/* =========================
            ENCABEZADO
        ========================= */}

        <div className="ventas-encabezado">

          <div>

            <h2>
              Ventas
            </h2>

            <p className="ventas-fecha">
              {ventas.length} órdenes registradas
            </p>

          </div>

          <button
            type="button"
            className="ventas-button-agregar"
            onClick={abrirNuevaVenta}
          >
            <Plus size={20} />

            Nueva venta
          </button>

        </div>

        {/* =========================
            CARDS
        ========================= */}

        <CardsVentas
          ventas={ventas}
        />

        {/* =========================
            FILTROS
        ========================= */}

        <FiltrosVentas
          filtro={filtro}
          setFiltro={setFiltro}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          totalResultados={ventas.length}
          totalConfirmado={ventas
            .filter(
              (venta) =>
                venta.estado === "completada"
            )
            .reduce(
              (total, venta) =>
                total + Number(venta.total),
              0
            )}
        />

        {/* =========================
            TABLA
        ========================= */}

        <TablaVentas
          filtro={filtro}
          busqueda={busqueda}
          ventas={ventas}
          cargando={cargandoVentas}
        />

       

        {mostrarNuevaVenta && (
          <NuevaVenta
            cerrarModal={cerrarNuevaVenta}
            onVentaCreada={manejarVentaCreada}
          />
        )}

      </div>

    </main>
  );
};

export default VentasAdmin;