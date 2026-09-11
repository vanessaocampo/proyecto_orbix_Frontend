import {
  X,
  ShoppingCart,
  User,
  DollarSign,
  Trash2,
  Plus,
  Minus,
  Search,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import "./NuevaVenta.css";

import ventasService from "../../../services/ventas.services";

interface NuevaVentaProps {
  cerrarModal: () => void;
  onVentaCreada: () => void | Promise<void>;
}

type Cliente = {
  idCliente: string;
  nombre: string;
  documento: string;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
};

type Producto = {
  idProducto: string;
  nombre: string;
  precio: number | string;
  stock: number;
};

type ProductoCarrito = {
  producto: Producto;
  cantidad: number;
};

const BASE_URL = "http://localhost:3000/api/v1";

const NuevaVenta = ({
  cerrarModal,
  onVentaCreada,
}: NuevaVentaProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [idCliente, setIdCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");

  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState("");

  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarProductos, setMostrarProductos] = useState(false);

  const [cantidad, setCantidad] = useState(1);

  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  // ==========================================
  // NUEVO CLIENTE
  // ==========================================

  const [mostrarNuevoCliente, setMostrarNuevoCliente] =
    useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    correo: "",
    direccion: "",
    ciudad: "",
  });

  const [guardandoCliente, setGuardandoCliente] =
    useState(false);

  // ==========================================
  // CARGAR CLIENTES
  // ==========================================

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No hay sesión activa.");
        }

        const response = await fetch(
          `${BASE_URL}/clientes?limit=500`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Error al cargar clientes."
          );
        }

        setClientes(data.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);

        setMensajeError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los clientes."
        );
      }
    };

    cargarClientes();
  }, []);

  // ==========================================
  // CARGAR PRODUCTOS
  // ==========================================

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No hay sesión activa.");
        }

        const response = await fetch(
          `${BASE_URL}/productos?limit=500`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Error al cargar productos."
          );
        }

        setProductos(data.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);

        setMensajeError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los productos."
        );
      }
    };

    cargarProductos();
  }, []);

  // ==========================================
  // PRODUCTOS FILTRADOS
  // ==========================================

  const productosFiltrados = useMemo(() => {
    const texto = busquedaProducto.toLowerCase().trim();

    if (!texto) {
      return productos;
    }

    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(texto)
    );
  }, [productos, busquedaProducto]);

  // ==========================================
  // SELECCIONAR PRODUCTO
  // ==========================================

  const seleccionarProducto = (producto: Producto) => {
    if (producto.stock <= 0) {
      return;
    }

    setProductoSeleccionado(producto.idProducto);
    setBusquedaProducto(producto.nombre);
    setMostrarProductos(false);
    setMensajeError("");
  };

  // ==========================================
  // CAMBIAR TEXTO DE BÚSQUEDA
  // ==========================================

  const cambiarBusquedaProducto = (
    texto: string
  ) => {
    setBusquedaProducto(texto);

    setProductoSeleccionado("");

    setMostrarProductos(true);
    setMensajeError("");
  };

  // ==========================================
  // AGREGAR PRODUCTO AL CARRITO
  // ==========================================

  const agregarProducto = () => {
    setMensajeError("");

    if (!productoSeleccionado) {
      setMensajeError("Debes seleccionar un producto.");
      return;
    }

    const producto = productos.find(
      (p) => p.idProducto === productoSeleccionado
    );

    if (!producto) {
      setMensajeError(
        "El producto seleccionado no existe."
      );
      return;
    }

    if (cantidad <= 0) {
      setMensajeError(
        "La cantidad debe ser mayor a cero."
      );
      return;
    }

    if (producto.stock <= 0) {
      setMensajeError(
        `El producto "${producto.nombre}" no tiene stock.`
      );
      return;
    }

    const existente = carrito.find(
      (item) =>
        item.producto.idProducto === producto.idProducto
    );

    if (existente) {
      const nuevaCantidad =
        existente.cantidad + cantidad;

      if (nuevaCantidad > producto.stock) {
        setMensajeError(
          `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}.`
        );
        return;
      }

      setCarrito(
        carrito.map((item) =>
          item.producto.idProducto ===
          producto.idProducto
            ? {
                ...item,
                cantidad: nuevaCantidad,
              }
            : item
        )
      );
    } else {
      if (cantidad > producto.stock) {
        setMensajeError(
          `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}.`
        );
        return;
      }

      setCarrito([
        ...carrito,
        {
          producto,
          cantidad,
        },
      ]);
    }

    setProductoSeleccionado("");
    setBusquedaProducto("");
    setCantidad(1);
    setMostrarProductos(false);
  };

  // ==========================================
  // CAMBIAR CANTIDAD
  // ==========================================

  const cambiarCantidad = (
    idProducto: string,
    nuevaCantidad: number
  ) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(idProducto);
      return;
    }

    const item = carrito.find(
      (producto) =>
        producto.producto.idProducto === idProducto
    );

    if (!item) {
      return;
    }

    if (nuevaCantidad > item.producto.stock) {
      setMensajeError(
        `Stock insuficiente para ${item.producto.nombre}. Disponible: ${item.producto.stock}.`
      );
      return;
    }

    setCarrito(
      carrito.map((producto) =>
        producto.producto.idProducto === idProducto
          ? {
              ...producto,
              cantidad: nuevaCantidad,
            }
          : producto
      )
    );

    setMensajeError("");
  };

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  const eliminarProducto = (idProducto: string) => {
    setCarrito(
      carrito.filter(
        (item) =>
          item.producto.idProducto !== idProducto
      )
    );

    setMensajeError("");
  };

  // ==========================================
  // TOTAL
  // ==========================================

  const total = carrito.reduce(
    (acumulado, item) =>
      acumulado +
      Number(item.producto.precio) * item.cantidad,
    0
  );

  // ==========================================
  // CAMBIAR DATOS DEL NUEVO CLIENTE
  // ==========================================

  const cambiarDatoNuevoCliente = (
    campo: keyof typeof nuevoCliente,
    valor: string
  ) => {
    setNuevoCliente((actual) => ({
      ...actual,
      [campo]: valor,
    }));

    setMensajeError("");
  };

  // ==========================================
  // CANCELAR NUEVO CLIENTE
  // ==========================================

  const cancelarNuevoCliente = () => {
    setMostrarNuevoCliente(false);

    setNuevoCliente({
      nombre: "",
      documento: "",
      telefono: "",
      correo: "",
      direccion: "",
      ciudad: "",
    });

    setMensajeError("");
  };

  // ==========================================
  // CREAR NUEVO CLIENTE
  // ==========================================

  const crearNuevoCliente = async () => {
    if (guardandoCliente || cargando) {
      return;
    }

    try {
      setMensajeError("");

      if (!nuevoCliente.nombre.trim()) {
        setMensajeError(
          "El nombre del cliente es obligatorio."
        );
        return;
      }

      if (!nuevoCliente.documento.trim()) {
        setMensajeError(
          "El documento del cliente es obligatorio."
        );
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay sesión activa.");
      }

      setGuardandoCliente(true);

      const clienteData = {
        nombre: nuevoCliente.nombre.trim(),
        documento: nuevoCliente.documento.trim(),
        telefono:
          nuevoCliente.telefono.trim() || null,
        correo:
          nuevoCliente.correo.trim() || null,
        direccion:
          nuevoCliente.direccion.trim() || null,
        ciudad:
          nuevoCliente.ciudad.trim() || null,
      };

      const response = await fetch(
        `${BASE_URL}/clientes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clienteData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "No se pudo crear el cliente."
        );
      }

      const clienteCreado: Cliente = data.data;

      setClientes((actuales) => [
        ...actuales,
        clienteCreado,
      ]);

      setIdCliente(clienteCreado.idCliente);

      setMostrarNuevoCliente(false);

      setNuevoCliente({
        nombre: "",
        documento: "",
        telefono: "",
        correo: "",
        direccion: "",
        ciudad: "",
      });

      setMensajeError("");
    } catch (error) {
      console.error(
        "Error al crear cliente:",
        error
      );

      setMensajeError(
        error instanceof Error
          ? error.message
          : "No se pudo crear el cliente."
      );
    } finally {
      setGuardandoCliente(false);
    }
  };

  // ==========================================
  // REGISTRAR VENTA
  // ==========================================

  const registrarVenta = async (
    estado: "completada" | "pendiente"
  ) => {
    if (cargando) {
      return;
    }

    try {
      setMensajeError("");

      if (!idCliente) {
        setMensajeError(
          "Debes seleccionar un cliente."
        );
        return;
      }

      if (carrito.length === 0) {
        setMensajeError(
          "Debes agregar al menos un producto."
        );
        return;
      }

      if (!metodoPago) {
        setMensajeError(
          "Debes seleccionar un método de pago."
        );
        return;
      }

      setCargando(true);

      const ventaData = {
        idCliente,
        estado,
        metodoPago,
        items: carrito.map((item) => ({
          idProducto: item.producto.idProducto,
          cantidad: item.cantidad,
          precioUnitario: Number(
            item.producto.precio
          ),
        })),
      };

      console.log(
        "Datos enviados para crear venta:",
        ventaData
      );

      await ventasService.crearVenta(ventaData);

      await onVentaCreada();

      cerrarModal();
    } catch (error) {
      console.error(
        "Error al registrar venta:",
        error
      );

      setMensajeError(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la venta."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="nueva-venta-overlay">
      <div className="nueva-venta-modal">

        {/* HEADER */}

        <div className="nueva-venta-header">
          <div className="nueva-venta-titulo">
            <ShoppingCart size={28} />

            <h2>Nueva venta</h2>
          </div>

          <button
            type="button"
            className="nueva-venta-cerrar"
            onClick={cerrarModal}
            disabled={cargando || guardandoCliente}
          >
            <X size={24} />
          </button>
        </div>

        {/* ERROR */}

        {mensajeError && (
          <div className="nueva-venta-error">
            {mensajeError}
          </div>
        )}

        {/* CLIENTE */}

        <div className="nueva-venta-seccion">
          <div className="nueva-venta-label">
            <User size={20} />

            <span>Cliente</span>
          </div>

          {!mostrarNuevoCliente ? (
            <div className="nueva-venta-cliente-selector">
              <select
                className="nueva-venta-select"
                value={idCliente}
                onChange={(e) =>
                  setIdCliente(e.target.value)
                }
                disabled={cargando}
              >
                <option value="">
                  Selecciona un cliente
                </option>

                {clientes.map((cliente) => (
                  <option
                    key={cliente.idCliente}
                    value={cliente.idCliente}
                  >
                    {cliente.nombre} -{" "}
                    {cliente.documento}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="nueva-venta-nuevo-cliente-btn"
                onClick={() => {
                  setMostrarNuevoCliente(true);
                  setMensajeError("");
                }}
                disabled={cargando}
              >
                <Plus size={18} />

                Nuevo cliente
              </button>
            </div>
          ) : (
            <div className="nueva-venta-nuevo-cliente">
              <div className="nueva-venta-nuevo-cliente-titulo">
                <strong>Nuevo cliente</strong>

                <button
                  type="button"
                  className="nueva-venta-cancelar-nuevo-cliente"
                  onClick={cancelarNuevoCliente}
                  disabled={guardandoCliente}
                >
                  <X size={17} />
                </button>
              </div>

              <div className="nueva-venta-cliente-formulario">
                <div className="nueva-venta-campo">
                  <label>
                    Nombre / Razón social *
                  </label>

                  <input
                    type="text"
                    value={nuevoCliente.nombre}
                    placeholder="Nombre del cliente"
                    onChange={(e) =>
                      cambiarDatoNuevoCliente(
                        "nombre",
                        e.target.value
                      )
                    }
                    disabled={guardandoCliente}
                  />
                </div>

                <div className="nueva-venta-campo">
                  <label>
                    Documento / NIT *
                  </label>

                  <input
                    type="text"
                    value={nuevoCliente.documento}
                    placeholder="Documento o NIT"
                    onChange={(e) =>
                      cambiarDatoNuevoCliente(
                        "documento",
                        e.target.value
                      )
                    }
                    disabled={guardandoCliente}
                  />
                </div>

                <div className="nueva-venta-campo">
                  <label>Teléfono</label>

                  <input
                    type="text"
                    value={nuevoCliente.telefono}
                    placeholder="Teléfono"
                    onChange={(e) =>
                      cambiarDatoNuevoCliente(
                        "telefono",
                        e.target.value
                      )
                    }
                    disabled={guardandoCliente}
                  />
                </div>

                <div className="nueva-venta-campo">
                  <label>Correo</label>

                  <input
                    type="email"
                    value={nuevoCliente.correo}
                    placeholder="Correo electrónico"
                    onChange={(e) =>
                      cambiarDatoNuevoCliente(
                        "correo",
                        e.target.value
                      )
                    }
                    disabled={guardandoCliente}
                  />
                </div>

                <div className="nueva-venta-campo">
                  <label>Dirección</label>

                  <input
                    type="text"
                    value={nuevoCliente.direccion}
                    placeholder="Dirección"
                    onChange={(e) =>
                      cambiarDatoNuevoCliente(
                        "direccion",
                        e.target.value
                      )
                    }
                    disabled={guardandoCliente}
                  />
                </div>

                <div className="nueva-venta-campo">
                  <label>Ciudad</label>

                  <input
                    type="text"
                    value={nuevoCliente.ciudad}
                    placeholder="Ciudad"
                    onChange={(e) =>
                      cambiarDatoNuevoCliente(
                        "ciudad",
                        e.target.value
                      )
                    }
                    disabled={guardandoCliente}
                  />
                </div>
              </div>

              <div className="nueva-venta-nuevo-cliente-acciones">
                <button
                  type="button"
                  className="nueva-venta-cancelar-cliente-btn"
                  onClick={cancelarNuevoCliente}
                  disabled={guardandoCliente}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="nueva-venta-guardar-cliente-btn"
                  onClick={crearNuevoCliente}
                  disabled={guardandoCliente}
                >
                  {guardandoCliente
                    ? "Guardando..."
                    : "Guardar cliente"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PRODUCTOS */}

        <div className="nueva-venta-seccion">
          <div className="nueva-venta-label">
            <ShoppingCart size={20} />

            <span>Productos</span>
          </div>

          <div className="nueva-venta-agregar-producto">

            {/* BUSCADOR DE PRODUCTOS */}

            <div className="nueva-venta-producto-buscador">
              <Search
                size={18}
                className="nueva-venta-producto-icono"
              />

              <input
                type="text"
                className="nueva-venta-producto-input"
                value={busquedaProducto}
                placeholder="Busca un producto..."
                onFocus={() => {
                  setMostrarProductos(true);
                }}
                onChange={(e) =>
                  cambiarBusquedaProducto(
                    e.target.value
                  )
                }
                disabled={cargando}
              />

              {mostrarProductos && (
                <div className="nueva-venta-productos-lista">

                  {productosFiltrados.length === 0 ? (
                    <div className="nueva-venta-producto-sin-resultados">
                      No se encontraron productos.
                    </div>
                  ) : (
                    productosFiltrados.map(
                      (producto) => (
                        <button
                          type="button"
                          key={producto.idProducto}
                          className={`nueva-venta-producto-opcion ${
                            producto.stock <= 0
                              ? "sin-stock"
                              : ""
                          } ${
                            producto.idProducto ===
                            productoSeleccionado
                              ? "seleccionado"
                              : ""
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                          }}
                          onClick={() =>
                            seleccionarProducto(
                              producto
                            )
                          }
                          disabled={
                            producto.stock <= 0
                          }
                        >
                          <span className="producto-opcion-nombre">
                            {producto.nombre}
                          </span>

                          <span className="producto-opcion-info">
                            $
                            {Number(
                              producto.precio
                            ).toLocaleString(
                              "es-CO"
                            )}{" "}
                            — Stock:{" "}
                            {producto.stock}
                          </span>
                        </button>
                      )
                    )
                  )}

                </div>
              )}
            </div>

            {/* CANTIDAD */}

            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) =>
                setCantidad(
                  Number(e.target.value)
                )
              }
              className="nueva-venta-cantidad"
              disabled={cargando}
            />

            {/* AGREGAR */}

            <button
              type="button"
              className="nueva-venta-agregar-producto-btn"
              onClick={agregarProducto}
              disabled={cargando}
            >
              <Plus size={18} />

              Agregar
            </button>
          </div>

          {/* CARRITO */}

          {carrito.length === 0 ? (
            <div className="nueva-venta-carrito-vacio">
              <strong>
                El carrito está vacío.
              </strong>

              <p>
                Selecciona productos para
                agregarlos a la venta.
              </p>
            </div>
          ) : (
            <div className="nueva-venta-carrito">
              {carrito.map((item) => (
                <div
                  key={
                    item.producto.idProducto
                  }
                  className="nueva-venta-producto"
                >
                  <div>
                    <strong>
                      {item.producto.nombre}
                    </strong>

                    <span>
                      $
                      {Number(
                        item.producto.precio
                      ).toLocaleString(
                        "es-CO"
                      )}{" "}
                      c/u
                    </span>
                  </div>

                  <div className="nueva-venta-producto-controles">
                    <button
                      type="button"
                      disabled={cargando}
                      onClick={() =>
                        cambiarCantidad(
                          item.producto
                            .idProducto,
                          item.cantidad - 1
                        )
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>
                      {item.cantidad}
                    </span>

                    <button
                      type="button"
                      disabled={cargando}
                      onClick={() =>
                        cambiarCantidad(
                          item.producto
                            .idProducto,
                          item.cantidad + 1
                        )
                      }
                    >
                      <Plus size={15} />
                    </button>

                    <strong>
                      $
                      {(
                        Number(
                          item.producto.precio
                        ) *
                        item.cantidad
                      ).toLocaleString(
                        "es-CO"
                      )}
                    </strong>

                    <button
                      type="button"
                      className="nueva-venta-eliminar"
                      disabled={cargando}
                      onClick={() =>
                        eliminarProducto(
                          item.producto
                            .idProducto
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MÉTODO DE PAGO */}

        <div className="nueva-venta-seccion">
          <div className="nueva-venta-label">
            <DollarSign size={20} />

            <span>
              Método de pago
            </span>
          </div>

          <div className="nueva-venta-metodos">
            <button
              type="button"
              className={`nueva-venta-metodo ${
                metodoPago === "efectivo"
                  ? "activo"
                  : ""
              }`}
              onClick={() =>
                setMetodoPago("efectivo")
              }
              disabled={cargando}
            >
              💵 Efectivo
            </button>

            <button
              type="button"
              className={`nueva-venta-metodo ${
                metodoPago === "transferencia"
                  ? "activo"
                  : ""
              }`}
              onClick={() =>
                setMetodoPago(
                  "transferencia"
                )
              }
              disabled={cargando}
            >
              🏦 Transferencia
            </button>
          </div>
        </div>

        {/* RESUMEN */}

        <div className="nueva-venta-resumen">
          <div>
            <span>
              Productos (
              {carrito.reduce(
                (total, item) =>
                  total + item.cantidad,
                0
              )}
              )
            </span>

            <strong>
              $
              {total.toLocaleString(
                "es-CO"
              )}
            </strong>
          </div>

          <div>
            <span>
              Total a pagar
            </span>

            <strong>
              $
              {total.toLocaleString(
                "es-CO"
              )}
            </strong>
          </div>
        </div>

        {/* ACCIONES */}

        <div className="nueva-venta-acciones">
          <button
            type="button"
            className="nueva-venta-pendiente"
            disabled={cargando || guardandoCliente}
            onClick={() =>
              registrarVenta("pendiente")
            }
          >
            Dejar pendiente
          </button>

          <button
            type="button"
            className="nueva-venta-registrar"
            disabled={cargando || guardandoCliente}
            onClick={() =>
              registrarVenta("completada")
            }
          >
            {cargando
              ? "Registrando..."
              : "✓ Registrar venta"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NuevaVenta;