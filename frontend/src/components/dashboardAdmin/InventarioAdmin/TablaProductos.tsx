import "./TablaProductos.css";

import type {
  ProductoInventario,
} from "../../../services/productos.services";

interface TablaProductosProps {
  productos: ProductoInventario[];
  onEditar: (producto: ProductoInventario) => void;
  onEliminar: (idProducto: string) => void;
}

const TablaProductos = ({
  productos,
  onEditar,
  onEliminar,
}: TablaProductosProps) => {
  return (
    <div className="tabla-productos">
      {/* ENCABEZADO */}
      <div className="tabla-productos-encabezado">
        <span>CÓDIGO</span>
        <span>PRODUCTO</span>
        <span>CATEGORÍA</span>
        <span>PRECIO UNIT.</span>
        <span>STOCK ACTUAL</span>
        <span>STOCK MÍN.</span>
        <span>PROVEEDOR</span>
        <span>ESTADO</span>
      </div>

      {/* PRODUCTOS */}
      {productos.map((producto) => {
        const stockBajo =
          producto.stock <= producto.stockMinimo;

        const estadoVisual = stockBajo
          ? "Stock bajo"
          : "Disponible";

        return (
          <div
            className="tabla-productos-fila"
            key={producto.idProducto}
          >
            {/* CÓDIGO */}
            <span className="producto-codigo">
              {producto.codigo}
            </span>

            {/* PRODUCTO */}
            <span className="producto-nombre">
              {producto.nombre}
            </span>

            {/* CATEGORÍA */}
            <span className="producto-categoria">
              {producto.categoria}
            </span>

            {/* PRECIO */}
            <span className="producto-precio">
              $ {producto.precio.toLocaleString("es-CO")}
            </span>

            {/* STOCK ACTUAL */}
            <span
              className={
                stockBajo
                  ? "producto-stock stock-bajo"
                  : "producto-stock"
              }
            >
              {producto.stock}
            </span>

            {/* STOCK MÍNIMO */}
            <span className="producto-stock-minimo">
              {producto.stockMinimo}
            </span>

            {/* PROVEEDOR */}
            <span className="producto-proveedor">
              {producto.proveedor}
            </span>

            {/* ESTADO */}
            <span
              className={
                stockBajo
                  ? "producto-estado estado-bajo"
                  : "producto-estado estado-disponible"
              }
            >
              {estadoVisual}
            </span>

            {/* ACCIONES */}
            <span className="producto-accion">
              <button
                type="button"
                onClick={() => onEditar(producto)}
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  onEliminar(producto.idProducto)
                }
              >
                Eliminar
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TablaProductos;