import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Users,
  Receipt,
  PackagePlus,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import useVendedorData from "../../hooks/useVendedorData";
import "../../pages/Vendedor/VendedorVentas.css";

const LIMITE_GRUPO = 4;

const BuscadorGlobal = () => {
  const { productos, clientes, ventas } = useVendedorData();
  const navigate = useNavigate();

  const [termino, setTermino] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [indiceActivo, setIndiceActivo] = useState(-1);

  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizar = (texto: string) =>
    texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  useEffect(() => {
    const enfocar = (evento: KeyboardEvent) => {
      if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "k") {
        evento.preventDefault();
        inputRef.current?.focus();
        setAbierto(true);
      } else if (
        evento.key === "/" &&
        !(evento.target instanceof HTMLInputElement) &&
        !(evento.target instanceof HTMLTextAreaElement)
      ) {
        evento.preventDefault();
        inputRef.current?.focus();
        setAbierto(true);
      }
    };

    window.addEventListener("keydown", enfocar);
    return () => window.removeEventListener("keydown", enfocar);
  }, []);

  useEffect(() => {
    const cerrar = (evento: MouseEvent) => {
      if (!contenedorRef.current?.contains(evento.target as Node)) {
        setAbierto(false);
      }
    };

    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  const busqueda = useMemo(() => {
    const terminoLimpio = normalizar(termino.trim());
    if (terminoLimpio.length < 1) return null;

    const coincide = (textos: (string | number | undefined)[]) =>
      textos.some((texto) =>
        String(texto ?? "").toLowerCase().includes(terminoLimpio),
      );

    const productosEncontrados = productos
      .filter((producto) =>
        coincide([
          producto.nombre,
          producto.categoria,
          producto.id,
          producto.idProducto,
        ]),
      )
      .slice(0, LIMITE_GRUPO);

    const clientesEncontrados = clientes
      .filter((cliente) =>
        coincide([
          cliente.nombre,
          cliente.ciudad,
          cliente.id,
          cliente.idCliente,
        ]),
      )
      .slice(0, LIMITE_GRUPO);

    const ventasEncontradas = ventas
      .filter((venta) =>
        coincide([venta.id, venta.idVenta, venta.cliente, venta.estado]),
      )
      .slice(0, LIMITE_GRUPO);

    return {
      terminoLimpio,
      productos: productosEncontrados,
      clientes: clientesEncontrados,
      ventas: ventasEncontradas,
      vacio:
        productosEncontrados.length === 0 &&
        clientesEncontrados.length === 0 &&
        ventasEncontradas.length === 0,
    };
  }, [termino, productos, clientes, ventas]);

  const irA = (ruta: string, estado?: Record<string, unknown>) => {
    setTermino("");
    setAbierto(false);
    setIndiceActivo(-1);
    navigate(ruta, estado ? { state: estado } : undefined);
  };

  const manejarTeclado = (evento: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!busqueda) return;

    const opciones: (() => void)[] = [
      ...busqueda.productos.map((producto) => () =>
        irA("/dashboard/vendedor/ventas", {
          abrirRegistro: true,
          productoId: producto.id,
        }),
      ),
      ...busqueda.clientes.map((cliente) => () =>
        irA("/dashboard/vendedor/ventas", {
          abrirRegistro: true,
          clienteId: cliente.id,
        }),
      ),
      ...busqueda.ventas.map((venta) => () =>
        irA("/dashboard/vendedor/ventas", { ventaId: venta.id }),
      ),
    ];

    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setAbierto(true);
      setIndiceActivo((actual) =>
        actual < opciones.length - 1 ? actual + 1 : actual,
      );
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setIndiceActivo((actual) => (actual > 0 ? actual - 1 : 0));
    } else if (evento.key === "Enter") {
      evento.preventDefault();
      if (indiceActivo >= 0 && opciones[indiceActivo]) {
        opciones[indiceActivo]();
      } else if (busqueda.productos.length > 0) {
        irA("/dashboard/vendedor/productos");
      }
    } else if (evento.key === "Escape") {
      setAbierto(false);
    }
  };

  return (
    <div className="vbusqueda" ref={contenedorRef}>
      <form
        className="vendedor-buscar"
        onSubmit={(evento) => {
          evento.preventDefault();
          irA("/dashboard/vendedor/productos");
        }}
      >
        <Search size={15} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar productos, clientes o ventas... (Ctrl+K)"
          value={termino}
          onChange={(evento) => {
            setTermino(evento.target.value);
            setAbierto(true);
            setIndiceActivo(-1);
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={manejarTeclado}
        />
      </form>

      {abierto && busqueda && (
        <div className="vbusqueda-panel">
          {busqueda.vacio ? (
            <p className="vbusqueda-vacio">
              Sin resultados para «{busqueda.terminoLimpio}»
            </p>
          ) : (
            <>
              {busqueda.productos.length > 0 && (
                <div className="vbusqueda-grupo">
                  <p className="vbusqueda-grupo-titulo">
                    Productos
                    <span>{busqueda.productos.length} resultado(s)</span>
                  </p>
                  {busqueda.productos.map((producto, indice) => {
                    const posicion = indice;
                    return (
                      <button
                        type="button"
                        key={producto.id}
                        className={`vbusqueda-item${indiceActivo === posicion ? " activo" : ""}`}
                        onMouseEnter={() => setIndiceActivo(posicion)}
                        onClick={() =>
                          irA("/dashboard/vendedor/ventas", {
                            abrirRegistro: true,
                            productoId: producto.id,
                          })
                        }
                      >
                        <span className="vbusqueda-item-icono producto">
                          <ShoppingBag size={14} />
                        </span>
                        <span className="vbusqueda-item-texto">
                          <strong>{producto.nombre}</strong>
                          <small>
                            {producto.categoria} · {producto.id} ·{" "}
                            {producto.stock} u.
                          </small>
                        </span>
                        <span className="vbusqueda-item-accion">
                          <PackagePlus size={13} />
                          Vender
                        </span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="vbusqueda-ver-todos"
                    onClick={() => irA("/dashboard/vendedor/productos")}
                  >
                    Ver todos los productos <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {busqueda.clientes.length > 0 && (
                <div className="vbusqueda-grupo">
                  <p className="vbusqueda-grupo-titulo">
                    Clientes
                    <span>{busqueda.clientes.length} resultado(s)</span>
                  </p>
                  {busqueda.clientes.map((cliente, indice) => {
                    const posicion = busqueda.productos.length + indice;
                    return (
                      <button
                        type="button"
                        key={cliente.id}
                        className={`vbusqueda-item${indiceActivo === posicion ? " activo" : ""}`}
                        onMouseEnter={() => setIndiceActivo(posicion)}
                        onClick={() =>
                          irA("/dashboard/vendedor/ventas", {
                            abrirRegistro: true,
                            clienteId: cliente.id,
                          })
                        }
                      >
                        <span className="vbusqueda-item-icono cliente">
                          <Users size={14} />
                        </span>
                        <span className="vbusqueda-item-texto">
                          <strong>{cliente.nombre}</strong>
                          <small>
                            {cliente.ciudad} · {cliente.id}
                          </small>
                        </span>
                        <span className="vbusqueda-item-accion">
                          <UserPlus size={13} />
                          Vender
                        </span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="vbusqueda-ver-todos"
                    onClick={() => irA("/dashboard/vendedor/clientes")}
                  >
                    Ver todos los clientes <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {busqueda.ventas.length > 0 && (
                <div className="vbusqueda-grupo">
                  <p className="vbusqueda-grupo-titulo">
                    Ventas
                    <span>{busqueda.ventas.length} resultado(s)</span>
                  </p>
                  {busqueda.ventas.map((venta, indice) => {
                    const posicion =
                      busqueda.productos.length + busqueda.clientes.length + indice;
                    return (
                      <button
                        type="button"
                        key={venta.id}
                        className={`vbusqueda-item${indiceActivo === posicion ? " activo" : ""}`}
                        onMouseEnter={() => setIndiceActivo(posicion)}
                        onClick={() =>
                          irA("/dashboard/vendedor/ventas", { ventaId: venta.id })
                        }
                      >
                        <span className="vbusqueda-item-icono venta">
                          <Receipt size={14} />
                        </span>
                        <span className="vbusqueda-item-texto">
                          <strong>
                            {venta.id} · {venta.cliente}
                          </strong>
                          <small>
                            <span
                              className={`vbusqueda-estado vventas-estado ${venta.estado
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {venta.estado}
                            </span>
                            {venta.fecha}
                          </small>
                        </span>
                        <span className="vbusqueda-item-accion">
                          Ver <ArrowRight size={13} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="vbusqueda-pie">
                Enter abre el resultado resaltado · Esc cierra
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BuscadorGlobal;