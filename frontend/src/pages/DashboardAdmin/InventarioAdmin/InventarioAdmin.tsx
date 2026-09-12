import { useEffect, useState } from "react";

import "./InventarioAdmin.css";

import Sidebar from "../../../components/dashboardAdmin/Sidebar";

import { Search, Bell, Plus } from "lucide-react";

import BuscarProductos from "../../../components/dashboardAdmin/InventarioAdmin/BuscarProductos";

import TablaProductos from "../../../components/dashboardAdmin/InventarioAdmin/TablaProductos";

import Advertencia from "../../../components/dashboardAdmin/InventarioAdmin/Advertencia";

import ModalAgregarProducto from "../../../components/dashboardAdmin/InventarioAdmin/ModalAgregarProducto";

import ConfirmarEliminacion from "../../../components/dashboardAdmin/InventarioAdmin/ConfirmarEliminacion";

import Notificacion from "../../../components/dashboardAdmin/InventarioAdmin/Notificacion";

import productosService, {
  type ProductoInventario,
} from "../../../services/productos.services";

const InventarioAdmin = () => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const [productoEditar, setProductoEditar] =
    useState<ProductoInventario | null>(null);

  const [productoEliminar, setProductoEliminar] =
    useState<ProductoInventario | null>(null);

  const [notificacion, setNotificacion] = useState("");

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todas");

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [productos, setProductos] =
    useState<ProductoInventario[]>([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError("");

      const productosObtenidos =
        await productosService.obtenerProductos();

      setProductos(productosObtenidos);
    } catch (error) {
      console.error("Error al cargar productos:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los productos.",
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // ABRIR MODAL PARA AGREGAR
  const abrirModalAgregar = () => {
    setProductoEditar(null);
    setMostrarModal(true);
  };

  // ABRIR MODAL PARA EDITAR
  const abrirModalEditar = (producto: ProductoInventario) => {
    setProductoEditar(producto);
    setMostrarModal(true);
  };

  // CERRAR MODAL
  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoEditar(null);
  };

  // PREPARAR ELIMINACIÓN
  const solicitarEliminar = (idProducto: string) => {
    const producto = productos.find(
      (item) => item.idProducto === idProducto,
    );

    if (!producto) {
      return;
    }

    setProductoEliminar(producto);
  };

  // CONFIRMAR ELIMINACIÓN
  const confirmarEliminar = async () => {
    if (!productoEliminar) {
      return;
    }

    try {
      setError("");

      await productosService.eliminarProducto(
        productoEliminar.idProducto,
      );

      setProductoEliminar(null);

      setNotificacion("Producto eliminado correctamente.");

      await cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      setProductoEliminar(null);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto.",
      );
    }
  };

  // FILTRAR PRODUCTOS
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      producto.categoria === categoriaSeleccionada;

    const texto = textoBusqueda.toLowerCase().trim();

    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(texto) ||
      producto.codigo.toLowerCase().includes(texto);

    return coincideCategoria && coincideBusqueda;
  });

  // PRODUCTOS CON STOCK BAJO
  const productosStockBajo = productos.filter(
    (producto) => producto.stock <= producto.stockMinimo,
  ).length;

  return (
    <main className="inventario-main">
      <Sidebar />

      <div className="inventario-contenido">
        {/* BARRA SUPERIOR */}
        <div className="inventario-barra-superior">
          <p>
            <span className="inventario-orbix">Orbix</span> /{" "}
            <span className="inventario-admin">Admin</span> /{" "}
            <span className="inventario-titulo">Inventario</span>
          </p>

          <div className="inventario-acciones-superiores">
            <form
              className="inventario-buscar"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search size={20} />

              <input
                type="text"
                placeholder="Buscar..."
              />
            </form>

            <div className="inventario-notifi">
              <Bell size={20} />
            </div>

            <div className="inventario-usuario">
              VO
            </div>
          </div>
        </div>

        {/* ENCABEZADO */}
        <div className="inventario-encabezado">
          <div>
            <h2>Inventario</h2>

            <p className="inventario-fecha">
              {productos.length} productos{" "}
              {productosStockBajo} con stock bajo
            </p>
          </div>

          <button
            className="inventario-button-agregar"
            onClick={abrirModalAgregar}
          >
            <Plus size={20} />
            Agregar producto
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "10px",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        )}

        {/* ADVERTENCIA */}
        {!cargando &&
          !error &&
          productosStockBajo > 0 && (
            <Advertencia cantidad={productosStockBajo} />
          )}

        {/* BUSCADOR Y FILTROS */}
        <BuscarProductos
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={setCategoriaSeleccionada}
          textoBusqueda={textoBusqueda}
          onBusquedaChange={setTextoBusqueda}
        />

        {/* TABLA */}
        {cargando ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Cargando productos...
          </div>
        ) : (
          <TablaProductos
            productos={productosFiltrados}
            onEditar={abrirModalEditar}
            onEliminar={solicitarEliminar}
          />
        )}
      </div>

      {/* MODAL AGREGAR / EDITAR */}
      {mostrarModal && (
        <ModalAgregarProducto
          productoEditar={productoEditar}
          onCerrar={cerrarModal}
          onProductoCreado={cargarProductos}
          onProductoGuardado={setNotificacion}
        />
      )}

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}
      {productoEliminar && (
        <ConfirmarEliminacion
          nombreProducto={productoEliminar.nombre}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setProductoEliminar(null)}
        />
      )}

      {/* NOTIFICACIÓN */}
      {notificacion && (
        <Notificacion
          mensaje={notificacion}
          onCerrar={() => setNotificacion("")}
        />
      )}
    </main>
  );
};

export default InventarioAdmin;