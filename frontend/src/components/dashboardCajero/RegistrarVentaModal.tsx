import { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import {
  clientesVendedor,
  productosVendedor,
  type ProductoVendedor,
} from "../../data/mockDataVendedor";

import "./RegistrarVentaModal.css";

type ItemSeleccionado = {
  producto: ProductoVendedor;
  cantidad: number;
};

type VentaRegistrada = {
  cliente: string;
  productos: ItemSeleccionado[];
  total: number;
  pago: "Efectivo" | "Transferencia";
};

type RegistrarVentaModalProps = {
  abierto: boolean;
  onCerrar: () => void;
  onRegistrar?: (venta: VentaRegistrada) => void;
};

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const RegistrarVentaModal = ({
  abierto,
  onCerrar,
  onRegistrar,
}: RegistrarVentaModalProps) => {
  const [idCliente, setIdCliente] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [nombreNuevoCliente, setNombreNuevoCliente] = useState("");
  const [ciudadNuevoCliente, setCiudadNuevoCliente] = useState("");
  const [items, setItems] = useState<ItemSeleccionado[]>([]);
  const [pago, setPago] = useState<"Efectivo" | "Transferencia">("Efectivo");
  const [busqueda, setBusqueda] = useState("");
  const [registrada, setRegistrada] = useState(false);

  const clienteSeleccionado = clientesVendedor.find(
    (cliente) => cliente.id === idCliente,
  );

  const nombreCliente = nuevoCliente
    ? nombreNuevoCliente.trim()
    : (clienteSeleccionado?.nombre ?? "");

  const productosFiltrados = productosVendedor.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const total = items.reduce(
    (acumulado, item) => acumulado + item.producto.precio * item.cantidad,
    0,
  );

  const totalItems = items.reduce(
    (acumulado, item) => acumulado + item.cantidad,
    0,
  );

  const agregarProducto = (producto: ProductoVendedor) => {
    setItems((actuales) => {
      const existente = actuales.find(
        (item) => item.producto.id === producto.id,
      );

      if (existente) {
        return actuales.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [...actuales, { producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id: string, delta: number) => {
    setItems((actuales) =>
      actuales
        .map((item) =>
          item.producto.id === id
            ? { ...item, cantidad: Math.max(0, item.cantidad + delta) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const quitarItem = (id: string) => {
    setItems((actuales) => actuales.filter((item) => item.producto.id !== id));
  };

  const manejarCantidadExacta = (id: string, cantidad: number) => {
    setItems((actuales) =>
      actuales
        .map((item) =>
          item.producto.id === id
            ? { ...item, cantidad: Math.max(1, cantidad) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const handleRegistrar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombreCliente || items.length === 0) return;

    onRegistrar?.({
      cliente: nombreCliente,
      productos: items,
      total,
      pago,
    });

    setRegistrada(true);
  };

  const cerrarYReiniciar = () => {
    onCerrar();
    setIdCliente("");
    setNuevoCliente(false);
    setNombreNuevoCliente("");
    setCiudadNuevoCliente("");
    setItems([]);
    setPago("Efectivo");
    setBusqueda("");
    setRegistrada(false);
  };

  if (!abierto) return null;

  const cantidadDe = (id: string) =>
    items.find((item) => item.producto.id === id)?.cantidad ?? 0;

  return (
    <div className="rvmodal-overlay" onClick={onCerrar}>
      <div
        className="rvmodal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Registro de ventas"
      >
        <div className="rvmodal-header">
          <div className="rvmodal-titulo-wrap">
            <h3>Registro de ventas</h3>
            <span className="rvmodal-badge">Orbix</span>
          </div>
          <p className="rvmodal-subtitulo">Una venta en pocos pasos</p>
          <button
            type="button"
            className="rvmodal-cerrar"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {registrada ? (
          <div className="rvmodal-exito">
            <span className="rvmodal-exito-icono">
              <CheckCircle2 size={28} />
            </span>
            <h3>Venta registrada</h3>
            <p>
              La venta por <strong>{formatoCOP(total)}</strong> a{" "}
              <strong>{nombreCliente}</strong> se registró
              correctamente.
            </p>
            <button
              type="button"
              className="rvmodal-exito-btn"
              onClick={cerrarYReiniciar}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegistrar}>
            <div className="rvmodal-cuerpo">
              {/* Cliente */}
              <div className="rvmodal-seccion">
                <div className="rvmodal-seccion-cabecera">
                  <p className="rvmodal-seccion-titulo">Seleccionar cliente</p>
                  <button
                    type="button"
                    className={`rvmodal-nuevo-cliente ${
                      nuevoCliente ? "activo" : ""
                    }`}
                    onClick={() => setNuevoCliente(!nuevoCliente)}
                  >
                    <UserPlus size={14} />
                    {nuevoCliente ? "Usar cliente existente" : "Nuevo cliente"}
                  </button>
                </div>

                {nuevoCliente ? (
                  <div className="rvmodal-nuevo-cliente-fila">
                    <input
                      type="text"
                      className="rvmodal-input"
                      placeholder="Nombre del cliente"
                      required
                      value={nombreNuevoCliente}
                      onChange={(e) => setNombreNuevoCliente(e.target.value)}
                    />
                    <input
                      type="text"
                      className="rvmodal-input"
                      placeholder="Ciudad (opcional)"
                      value={ciudadNuevoCliente}
                      onChange={(e) => setCiudadNuevoCliente(e.target.value)}
                    />
                  </div>
                ) : (
                  <select
                    className="rvmodal-select"
                    required={!nuevoCliente}
                    value={idCliente}
                    onChange={(e) => setIdCliente(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecciona un cliente
                    </option>
                    {clientesVendedor.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} · {cliente.ciudad}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Productos */}
              <div className="rvmodal-seccion">
                <p className="rvmodal-seccion-titulo">
                  Buscar y agregar productos
                </p>
                <input
                  type="text"
                  className="rvmodal-buscar"
                  placeholder="Buscar por nombre o categoría..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />

                <div className="rvmodal-productos">
                  {productosFiltrados.map((producto) => {
                    const cantidad = cantidadDe(producto.id);

                    return (
                      <div
                        className={`rvmodal-producto ${
                          cantidad > 0 ? "agregado" : ""
                        }`}
                        key={producto.id}
                      >
                        <div className="rvmodal-producto-info">
                          <p className="rvmodal-producto-nombre">
                            {producto.nombre}
                          </p>
                          <p className="rvmodal-producto-detalle">
                            {producto.categoria} · Stock {producto.stock} ·{" "}
                            {formatoCOP(producto.precio)}
                          </p>
                        </div>

                        {cantidad > 0 ? (
                          <div className="rvmodal-stepper-cant">
                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidad(producto.id, -1)
                              }
                              aria-label="Disminuir cantidad"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={producto.stock}
                              value={cantidad}
                              onChange={(e) =>
                                manejarCantidadExacta(
                                  producto.id,
                                  Number(e.target.value),
                                )
                              }
                            />
                            <button
                              type="button"
                              onClick={() => cambiarCantidad(producto.id, 1)}
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="rvmodal-producto-agregar"
                            onClick={() => agregarProducto(producto)}
                          >
                            <Plus size={15} />
                            Agregar
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {productosFiltrados.length === 0 && (
                    <p className="rvmodal-sin-resultados">
                      No se encontraron productos.
                    </p>
                  )}
                </div>
              </div>

              {/* Resumen */}
              {items.length > 0 && (
                <div className="rvmodal-seccion">
                  <p className="rvmodal-seccion-titulo">
                    Resumen · {totalItems}{" "}
                    {totalItems === 1 ? "producto" : "productos"}
                  </p>
                  <div className="rvmodal-resumen-lista">
                    {items.map((item) => (
                      <div
                        className="rvmodal-resumen-fila"
                        key={item.producto.id}
                      >
                        <span>
                          {item.producto.nombre}{" "}
                          <em>
                            × {item.cantidad} ·{" "}
                            {formatoCOP(item.producto.precio)}
                          </em>
                        </span>
                        <strong>
                          {formatoCOP(item.producto.precio * item.cantidad)}
                        </strong>
                        <button
                          type="button"
                          className="rvmodal-resumen-quitar"
                          onClick={() => quitarItem(item.producto.id)}
                          aria-label={`Quitar ${item.producto.nombre}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="rvmodal-resumen-fila total">
                      <span>Total</span>
                      <strong>{formatoCOP(total)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Pago */}
              <div className="rvmodal-seccion">
                <p className="rvmodal-seccion-titulo">Método de pago</p>
                <div className="rvmodal-pago">
                  <button
                    type="button"
                    className={pago === "Efectivo" ? "activo" : ""}
                    onClick={() => setPago("Efectivo")}
                  >
                    Efectivo
                  </button>
                  <button
                    type="button"
                    className={pago === "Transferencia" ? "activo" : ""}
                    onClick={() => setPago("Transferencia")}
                  >
                    Transferencia
                  </button>
                </div>
              </div>
            </div>

            <div className="rvmodal-footer">
              <div className="rvmodal-total">
                <span>Total</span>
                <strong>{formatoCOP(total)}</strong>
              </div>
              <button
                type="submit"
                className="rvmodal-registrar"
                disabled={!nombreCliente || items.length === 0}
              >
                <Check size={16} />
                Registrar venta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrarVentaModal;