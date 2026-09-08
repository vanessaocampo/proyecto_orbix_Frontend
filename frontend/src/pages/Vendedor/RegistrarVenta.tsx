import { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  Search,
  UserPlus,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import {
  productosVendedor,
  type ClienteVendedor,
  type DetalleVenta,
  type ProductoVendedor,
} from "../../data/mockDataVendedor";
import clienteService from "../../services/clientes.services";
import vendedorService from "../../services/vendedor.services";

import "./RegistrarVenta.css";

type ItemSeleccionado = {
  producto: ProductoVendedor;
  cantidad: number;
};

type RegistrarVentaProps = {
  onCerrar?: () => void;
  productos?: ProductoVendedor[];
  clientes?: ClienteVendedor[];
  productoInicialId?: string;
  clienteInicialId?: string;
  itemsIniciales?: DetalleVenta[];
  metodoPagoInicial?: "efectivo" | "tarjeta" | "transferencia";
  onVentaRegistrada?: () => void;
  modoEdicion?: boolean;
};

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

const RegistrarVenta = ({
  onCerrar,
  productos = productosVendedor,
  clientes = [],
  productoInicialId,
  clienteInicialId,
  itemsIniciales,
  metodoPagoInicial,
  onVentaRegistrada,
  modoEdicion = false,
}: RegistrarVentaProps) => {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [idCliente, setIdCliente] = useState(clienteInicialId ?? "");
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [nombreNuevoCliente, setNombreNuevoCliente] = useState("");
  const [documentoNuevoCliente, setDocumentoNuevoCliente] = useState("");
  const [items, setItems] = useState<ItemSeleccionado[]>(() => {
    const desdeItemsIniciales = (itemsIniciales ?? [])
      .map((detalle) => {
        const producto = productos.find(
          (p) => p.idProducto === detalle.idProducto,
        );
        return producto
          ? { producto, cantidad: Math.min(detalle.cantidad, producto.stock || 1) }
          : null;
      })
      .filter((item): item is ItemSeleccionado => item !== null);

    if (desdeItemsIniciales.length > 0) return desdeItemsIniciales;

    const productoInicial = productos.find(
      (producto) => producto.id === productoInicialId,
    );

    return productoInicial ? [{ producto: productoInicial, cantidad: 1 }] : [];
  });
  const [pago, setPago] = useState<"Efectivo" | "Transferencia">(() =>
    metodoPagoInicial === "transferencia" ? "Transferencia" : "Efectivo",
  );
  const [registrada, setRegistrada] = useState(false);
  const [guardadaPendiente, setGuardadaPendiente] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState("");

  const clienteSeleccionado = clientes.find(
    (cliente) => cliente.id === idCliente,
  );

  const nombreCliente = nuevoCliente
    ? nombreNuevoCliente.trim()
    : (clienteSeleccionado?.nombre ?? "");

  const tieneCliente = nuevoCliente
    ? nombreNuevoCliente.trim() !== "" && documentoNuevoCliente.trim() !== ""
    : !!clienteSeleccionado;

  const categorias = [
    "Todas",
    ...Array.from(new Set(productos.map((producto) => producto.categoria))).sort(),
  ];

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoria === "Todas" || producto.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  const total = items.reduce(
    (acumulado, item) => acumulado + item.producto.precio * item.cantidad,
    0,
  );

  const totalItems = items.reduce(
    (acumulado, item) => acumulado + item.cantidad,
    0,
  );

  const cantidadDe = (id: string) =>
    items.find((item) => item.producto.id === id)?.cantidad ?? 0;

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

  const quitarItem = (id: string) => {
    setItems((actuales) => actuales.filter((item) => item.producto.id !== id));
  };

  const limpiarVenta = () => {
    setIdCliente("");
    setNuevoCliente(false);
    setNombreNuevoCliente("");
    setDocumentoNuevoCliente("");
    setItems([]);
    setPago("Efectivo");
    setRegistrada(false);
    setGuardadaPendiente(false);
    setErrorRegistro("");
  };

  const handleRegistrar = async (estado: "pendiente" | "completada") => {
    if (!tieneCliente || items.length === 0) return;

    setEnviando(true);
    setErrorRegistro("");

    try {
      const idClienteVenta =
        clienteSeleccionado?.idCliente ??
        (await clienteService.crear({
          nombre: nombreNuevoCliente.trim(),
          documento: documentoNuevoCliente.trim(),
        })).data.idCliente;

      await vendedorService.crearVenta({
        idCliente: idClienteVenta,
        estado,
        metodoPago: pago === "Efectivo" ? "efectivo" : "transferencia",
        items: items.map((item) => {
          if (!item.producto.idProducto) {
            throw new Error("El producto no tiene identificador en la base de datos.");
          }

          return {
            idProducto: item.producto.idProducto,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
          };
        }),
      });

      onVentaRegistrada?.();
      setGuardadaPendiente(estado === "pendiente");
      setRegistrada(true);
    } catch (err) {
      setErrorRegistro(
        err instanceof Error ? err.message : "Error al registrar la venta.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const dejarPendiente = () => {
    const confirmar = window.confirm(
      "Esta venta quedará como VENTA PENDIENTE: los productos no van a estar en el inventario hasta que cambies el estado de esta venta. ¿Continuar?",
    );
    if (confirmar) {
      void handleRegistrar("pendiente");
    }
  };

  return (
    <div className="rventa-flex">
      <div className="rventa-header">
        <div>
          <h1 className="rventa-titulo">
            {modoEdicion ? "✏️ Modificar venta" : "🛒 Registrar venta"}
          </h1>
          <p className="rventa-sub">
            {modoEdicion
              ? "Venta pendiente abierta: cambia los productos o el cliente y vuelve a registrar."
              : "Busca productos, agrégalos a la venta y confirma."}
          </p>
        </div>

        {onCerrar && (
          <button
            type="button"
            className="rventa-volver"
            onClick={onCerrar}
          >
            <ArrowLeft size={16} />
            Volver a mis ventas
          </button>
        )}
      </div>

        {/* Vista completa */}
        <div className="rventa-layout">
          {/* Catálogo */}
          <section className="rventa-catalogo">
            <div className="rventa-catalogo-filtros">
              <div className="rventa-buscar">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Buscar producto o categoría..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="rventa-categorias">
                {categorias.map((c) => (
                  <button
                    key={c}
                    className={categoria === c ? "activo" : ""}
                    onClick={() => setCategoria(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="rventa-grid">
{productosFiltrados.map((producto) => {
                const agotado = producto.stock === 0;
                const bajoStock =
                  producto.stock > 0 && producto.stock <= producto.minStock;
                const cantidad = cantidadDe(producto.id);

  return (
                  <div
                    className={`rventa-card${agotado ? " agotado" : ""}${
                      cantidad > 0 ? " en-carrito" : ""
                    }`}
                    key={producto.id}
                  >
                    <span className="rventa-cantidad-badge">
                      {cantidad > 0 && <span>{cantidad}</span>}
                    </span>

                    <div className="rventa-card-info">
                      <p className="rventa-card-categoria">{producto.categoria}</p>
                      <p className="rventa-card-nombre">{producto.nombre}</p>
                      <p className="rventa-card-precio">{formatoCOP(producto.precio)}</p>
                    </div>

                    <div className="rventa-card-pie">
                      <span
                        className={`rventa-card-stock ${
                          agotado ? "sin-stock" : bajoStock ? "bajo" : ""
                        }`}
                      >
                        {agotado
                          ? "Sin stock"
                          : bajoStock
                            ? `Stock bajo · ${producto.stock}u`
                            : `${producto.stock} u. disponibles`}
                      </span>

                      {cantidad > 0 ? (
                        <div className="rventa-card-cantidad">
                          <button
                            type="button"
                            onClick={() => cambiarCantidad(producto.id, -1)}
                            aria-label="Disminuir"
                          >
                            <Minus size={14} />
                          </button>
                          <span>{cantidad}</span>
                          <button
                            type="button"
                            onClick={() => cambiarCantidad(producto.id, 1)}
                            aria-label="Aumentar"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="rventa-card-agregar"
                          disabled={agotado}
                          onClick={() => agregarProducto(producto)}
                        >
                          <Plus size={15} />
                          {agotado ? "Agotado" : "Agregar"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {productosFiltrados.length === 0 && (
                <p className="rventa-sin-resultados">
                  No se encontraron productos.
                </p>
              )}
            </div>
          </section>

          {/* Panel de venta */}
          <aside className="rventa-panel">
            <div className="rventa-panel-titulo">
              <ShoppingCart size={17} />
              <span>Nueva venta</span>
              {totalItems > 0 && <b>{totalItems}</b>}
            </div>

            {/* Cliente */}
            <div className="rventa-panel-seccion">
              <div className="rventa-panel-seccion-cabecera">
                <p className="rventa-panel-label">👤 Cliente</p>
                <button
                  type="button"
                  className={`rventa-nuevo-cliente ${
                    nuevoCliente ? "activo" : ""
                  }`}
                  onClick={() => setNuevoCliente(!nuevoCliente)}
                >
                  <UserPlus size={13} />
                  {nuevoCliente ? "Existente" : "Nuevo"}
                </button>
              </div>

              {nuevoCliente ? (
                <div className="rventa-nuevo-fila">
                  <input
                    type="text"
                    className="rventa-input"
                    placeholder="Nombre *"
                    value={nombreNuevoCliente}
                    onChange={(e) => setNombreNuevoCliente(e.target.value)}
                  />
                  <input
                    type="text"
                    className="rventa-input"
                    placeholder="Documento *"
                    value={documentoNuevoCliente}
                    onChange={(e) => setDocumentoNuevoCliente(e.target.value)}
                  />
                </div>
              ) : (
<select
                  className="rventa-select"
                  value={idCliente}
                  onChange={(e) => setIdCliente(e.target.value)}
                >
                  <option value="" disabled>
                    {clientes.length === 0
                      ? "No hay clientes registrados"
                      : "Selecciona un cliente"}
                  </option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} · {cliente.ciudad}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Items */}
            <div className="rventa-panel-items">
              {items.length === 0 ? (
                <div className="rventa-panel-vacio">
                  <p>El carrito está vacío.</p>
                  <span>Agrega productos desde el catálogo.</span>
                </div>
              ) : (
                items.map((item) => (
                  <div className="rventa-panel-item" key={item.producto.id}>
                    <div className="rventa-panel-item-info">
                      <p className="rventa-panel-item-nombre">
                        {item.producto.nombre}
                      </p>
                      <p className="rventa-panel-item-precio">
                        {formatoCOP(item.producto.precio)} / unidad
                      </p>
                    </div>

                    <div className="rventa-panel-item-cant">
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(item.producto.id, -1)}
                        aria-label="Disminuir"
                      >
                        <Minus size={13} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.producto.stock}
                        value={item.cantidad}
                        onChange={(e) =>
                          manejarCantidadExacta(
                            item.producto.id,
                            Number(e.target.value),
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(item.producto.id, 1)}
                        aria-label="Aumentar"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <span className="rventa-panel-item-subtotal">
                      {formatoCOP(item.producto.precio * item.cantidad)}
                    </span>

                    <button
                      type="button"
                      className="rventa-panel-item-quitar"
                      onClick={() => quitarItem(item.producto.id)}
                      aria-label={`Quitar ${item.producto.nombre}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Pago */}
            <div className="rventa-panel-seccion">
              <p className="rventa-panel-label">💰 Método de pago</p>
              <div className="rventa-pago">
                <button
                  type="button"
                  className={pago === "Efectivo" ? "activo" : ""}
                  onClick={() => setPago("Efectivo")}
                >
                  💵 Efectivo
                </button>
                <button
                  type="button"
                  className={pago === "Transferencia" ? "activo" : ""}
                  onClick={() => setPago("Transferencia")}
                >
                  🏦 Transferencia
                </button>
              </div>
            </div>

            {/* Total + registrar */}
            <div className="rventa-panel-total">
              <div className="rventa-panel-total-fila">
                <span>Productos ({totalItems})</span>
                <strong>{formatoCOP(total)}</strong>
              </div>
              <div className="rventa-panel-total-fila total">
                <span>Total a pagar</span>
                <strong>{formatoCOP(total)}</strong>
              </div>

              {errorRegistro && (
                <p className="rventa-error">{errorRegistro}</p>
              )}

              <div className="rventa-acciones">
                <button
                  type="button"
                  className="rventa-registrar"
                  disabled={!tieneCliente || items.length === 0 || enviando}
                  onClick={dejarPendiente}
                >
                  <span className="rventa-guardar">Dejar pendiente</span>
                </button>

                <button
                  type="button"
                  className="rventa-registrar rventa-registrar-confirmar"
                  disabled={!tieneCliente || items.length === 0 || enviando}
                  onClick={() => handleRegistrar("completada")}
                >
                  {enviando ? (
                    <span className="rventa-enviando">Registrando...</span>
                  ) : (
                    <>
                      <Check size={17} />
                      Registrar venta
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Confirmación */}
        {registrada && (
          <div className="rventa-exito-overlay" onClick={limpiarVenta}>
            <div
              className="rventa-exito"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="rventa-exito-cerrar"
                onClick={limpiarVenta}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
              {guardadaPendiente ? (
                <>
                  <span className="rventa-exito-icono">🕐</span>
                  <h3>Venta pendiente</h3>
                  <p>
                    La venta por <strong>{formatoCOP(total)}</strong> a{" "}
                    <strong>{nombreCliente}</strong> quedó como{" "}
                    <strong>venta pendiente</strong>. Los productos no van a estar
                    en el inventario hasta que cambies el estado de esta venta.
                  </p>
                </>
              ) : (
                <>
                  <span className="rventa-exito-icono">✅</span>
                  <h3>Venta registrada</h3>
                  <p>
                    La venta por <strong>{formatoCOP(total)}</strong> a{" "}
                    <strong>{nombreCliente}</strong> se registró correctamente.
                  </p>
                </>
              )}
              <button
                type="button"
                className="rventa-exito-btn"
                onClick={limpiarVenta}
              >
                Nuevo registro de venta
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

export default RegistrarVenta;