import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MapPin } from "lucide-react";
import VendedorLayout from "../../components/dashboardCajero/VendedorLayout";
import RegistrarClienteModal from "../../components/dashboardCajero/RegistrarClienteModal";
import CargandoVendedor from "../../components/dashboardCajero/CargandoVendedor";
import useVendedorData from "../../hooks/useVendedorData";
import type { ClienteVendedor } from "../../data/mockDataVendedor";
import clienteService, {
  type ClienteNuevo,
} from "../../services/clientes.services";

import "./VendedorClientes.css";

const COLORES_AVATAR = ["#8b5cf6", "#0e7490", "#10b981", "#f59e0b", "#3b82f6"];

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type DatosCliente = {
  totalCompras: number;
  pedidos: number;
  ultimo: string;
};

const VendedorClientes = () => {
  const { clientes, ventas, agregarClienteLocal, refrescar, cargando } =
    useVendedorData();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const datosCliente = useMemo(() => {
    const mapa = new Map<string, DatosCliente>();

    for (const cliente of clientes) {
      const coincidePorId = cliente.idCliente != null;

      const ventasCliente = ventas.filter((venta) =>
        coincidePorId
          ? venta.idCliente === cliente.idCliente
          : venta.cliente === cliente.nombre,
      );

      const activas = ventasCliente.filter((venta) => venta.estado !== "Anulada");

      const ultimaVenta = ventasCliente.reduce<typeof ventasCliente[number] | null>(
        (mayor, venta) =>
          !mayor || (venta.fechaISO ?? "") > (mayor.fechaISO ?? "") ? venta : mayor,
        null,
      );

      mapa.set(cliente.id, {
        totalCompras: activas.reduce(
          (acumulado, venta) => acumulado + venta.monto,
          0,
        ),
        pedidos: activas.length,
        ultimo: ultimaVenta
          ? ultimaVenta.fechaISO
            ? formatoFecha(ultimaVenta.fechaISO)
            : ultimaVenta.fecha
          : cliente.ultimo,
      });
    }

    return mapa;
  }, [clientes, ventas]);

  const agregarCliente = async (cliente: ClienteNuevo) => {
    setEnviando(true);
    setError("");

    try {
      const response = await clienteService.crear(cliente);

      const creado: ClienteVendedor = {
        id: String(response.data.idCliente ?? ""),
        idCliente: String(response.data.idCliente ?? ""),
        codigoCliente: response.data.codigoCliente
          ? String(response.data.codigoCliente)
          : undefined,
        nombre: response.data.nombre,
        ciudad: response.data.ciudad ?? "—",
        totalCompras: 0,
        pedidos: 0,
        ultimo: "—",
      };

      agregarClienteLocal(creado);
      await refrescar();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar el cliente.",
      );
      throw err;
    } finally {
      setEnviando(false);
    }
  };

  const filtrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.ciudad.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const totalCompras = [...datosCliente.values()].reduce(
    (acumulado, cliente) => acumulado + cliente.totalCompras,
    0,
  );

  return (
    <VendedorLayout vista="Mis Clientes">
      <div className="vclientes-flex">
        {cargando ? (
          <CargandoVendedor />
        ) : (
          <>
        <div className="vclientes-header">
          <div>
            <h1 className="vclientes-titulo">Mis Clientes</h1>
            <p className="vclientes-sub">
              {clientes.length} clientes asignados · {formatoCOP(totalCompras)} en compras
            </p>
          </div>

          <button
            className="vclientes-nuevo"
            onClick={() => setModalAbierto(true)}
          >
            <Plus size={16} />
            Nuevo cliente
          </button>
        </div>

        {/* Búsqueda */}
        <div className="vclientes-buscar">
          <Search size={15} />
          <input
            type="text"
            placeholder="Buscar cliente o ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tarjetas */}
        <div className="vclientes-grid">
          {filtrados.map((cliente) => {
            const color = COLORES_AVATAR[cliente.nombre.charCodeAt(0) % COLORES_AVATAR.length];
            const iniciales = cliente.nombre
              .split(" ")
              .slice(0, 2)
              .map((palabra) => palabra[0])
              .join("")
              .toUpperCase();

            const datos = datosCliente.get(cliente.id) ?? {
              totalCompras: 0,
              pedidos: 0,
              ultimo: "—",
            };

            return (
              <div className="vcliente-card" key={cliente.id}>
                <div className="vcliente-top">
                  <div
                    className="vcliente-avatar"
                    style={{ backgroundColor: `${color}22`, color }}
                  >
                    {iniciales}
                  </div>
                  <div className="vcliente-nombre-box">
                    <p className="vcliente-nombre">{cliente.nombre}</p>
                    <p className="vcliente-id">{cliente.codigoCliente ?? cliente.id}</p>
                  </div>
                </div>

                <div className="vcliente-divisor" />

                <div className="vcliente-datos-grid">
                  <div>
                    <p className="vcliente-dato-label">Total compras</p>
                    <p className="vcliente-dato-valor">{formatoCOP(datos.totalCompras)}</p>
                  </div>
                  <div>
                    <p className="vcliente-dato-label">Pedidos</p>
                    <p className="vcliente-dato-valor">{datos.pedidos}</p>
                  </div>
                </div>

                <div className="vcliente-ubicacion">
                  <MapPin size={13} />
                  <span>{cliente.ciudad}</span>
                  <span className="vcliente-ultimo">{datos.ultimo}</span>
                </div>

                <button
                  className="vcliente-boton"
                  onClick={() =>
                    navigate("/dashboard/vendedor/ventas", {
                      state: { abrirRegistro: true, clienteId: cliente.id },
                    })
                  }
                >
                  Nueva venta para este cliente
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Registrar Cliente */}
        <RegistrarClienteModal
          abierto={modalAbierto}
          onCerrar={() => {
            setModalAbierto(false);
            setError("");
          }}
          onRegistrar={agregarCliente}
          enviando={enviando}
          error={error}
        />
          </>
        )}
      </div>
    </VendedorLayout>
  );
};

export default VendedorClientes;