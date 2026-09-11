import { useEffect, useState } from "react";

import "./ModalAgregarProducto.css";

import productosService, {
  type ProductoInventario,
} from "../../../services/productos.services";

import categoriasService, {
  type Categoria,
} from "../../../services/categorias.services";

import proveedoresService, {
  type Proveedor,
} from "../../../services/proveedores.services";

interface ModalAgregarProductoProps {
  onCerrar: () => void;
  onProductoCreado: () => void;
  onProductoGuardado: (mensaje: string) => void;
  productoEditar: ProductoInventario | null;
}

const ModalAgregarProducto = ({
  onCerrar,
  onProductoCreado,
  onProductoGuardado,
  productoEditar,
}: ModalAgregarProductoProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [estado, setEstado] = useState("activo");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] =
    useState(false);

  const [mostrarNuevoProveedor, setMostrarNuevoProveedor] =
    useState(false);

  const [nombreNuevaCategoria, setNombreNuevaCategoria] =
    useState("");

  const [descripcionNuevaCategoria, setDescripcionNuevaCategoria] =
    useState("");

  const [nombreNuevoProveedor, setNombreNuevoProveedor] =
    useState("");

  const [nitNuevoProveedor, setNitNuevoProveedor] =
    useState("");

  const [guardando, setGuardando] = useState(false);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);
  const [error, setError] = useState("");

  const modoEdicion = productoEditar !== null;

  const cargarOpciones = async () => {
    try {
      setCargandoOpciones(true);

      const [categoriasObtenidas, proveedoresObtenidos] =
        await Promise.all([
          categoriasService.obtenerCategorias(),
          proveedoresService.obtenerProveedores(),
        ]);

      setCategorias(categoriasObtenidas);
      setProveedores(proveedoresObtenidos);
    } catch (error) {
      console.error(
        "Error al cargar categorías y proveedores:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las categorías y proveedores.",
      );
    } finally {
      setCargandoOpciones(false);
    }
  };

  useEffect(() => {
    cargarOpciones();
  }, []);

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);

      setDescripcion(
        productoEditar.descripcion ?? "",
      );

      setPrecioCompra(
        String(productoEditar.precioCompra),
      );

      setPrecio(
        String(productoEditar.precio),
      );

      setStock(
        String(productoEditar.stock),
      );

      setStockMinimo(
        String(productoEditar.stockMinimo),
      );

      setCategoria("");
      setProveedor("");

      setEstado(productoEditar.estado);
    } else {
      setNombre("");
      setDescripcion("");
      setPrecioCompra("");
      setPrecio("");
      setStock("");
      setStockMinimo("");
      setCategoria("");
      setProveedor("");
      setEstado("activo");
    }

    setError("");
  }, [productoEditar]);

  const crearNuevaCategoria = async () => {
    if (!nombreNuevaCategoria.trim()) {
      setError("Debes ingresar el nombre de la categoría.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const nuevaCategoria =
        await categoriasService.crearCategoria(
          nombreNuevaCategoria.trim(),
          descripcionNuevaCategoria.trim() || undefined,
        );

      setCategorias((categoriasActuales) => [
        ...categoriasActuales,
        nuevaCategoria,
      ]);

      setCategoria(nuevaCategoria.idCategoria);

      setNombreNuevaCategoria("");
      setDescripcionNuevaCategoria("");
      setMostrarNuevaCategoria(false);
    } catch (error) {
      console.error(
        "Error al crear categoría:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la categoría.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const crearNuevoProveedor = async () => {
    if (!nombreNuevoProveedor.trim()) {
      setError("Debes ingresar el nombre del proveedor.");
      return;
    }

    if (!nitNuevoProveedor.trim()) {
      setError("Debes ingresar el NIT del proveedor.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const nuevoProveedor =
        await proveedoresService.crearProveedor(
          nombreNuevoProveedor.trim(),
          nitNuevoProveedor.trim(),
        );

      setProveedores((proveedoresActuales) => [
        ...proveedoresActuales,
        nuevoProveedor,
      ]);

      setProveedor(nuevoProveedor.idProveedor);

      setNombreNuevoProveedor("");
      setNitNuevoProveedor("");
      setMostrarNuevoProveedor(false);
    } catch (error) {
      console.error(
        "Error al crear proveedor:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear el proveedor.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      setGuardando(true);
      setError("");

      if (modoEdicion) {
        await productosService.actualizarProducto(
          productoEditar.idProducto,
          {
            nombre: nombre.trim(),

            descripcion:
              descripcion.trim() || undefined,

            precioCompra:
              Number(precioCompra),

            precio: Number(precio),

            stock: Number(stock),

            stockMinimo:
              Number(stockMinimo),

            estado: estado as
              | "activo"
              | "inactivo"
              | "agotado"
              | "descontinuado",
          },
        );

        await onProductoCreado();

        onCerrar();

        onProductoGuardado(
          "Producto actualizado correctamente.",
        );
      } else {
        if (!categoria) {
          throw new Error(
            "Debes seleccionar una categoría.",
          );
        }

        await productosService.crearProducto({
          nombre: nombre.trim(),

          descripcion:
            descripcion.trim() || undefined,

          precioCompra:
            Number(precioCompra),

          precio: Number(precio),

          stock: Number(stock),

          stockMinimo:
            Number(stockMinimo),

          idCategoria: categoria,

          idProveedor:
            proveedor || null,

          estado: estado as
            | "activo"
            | "inactivo"
            | "agotado"
            | "descontinuado",
        });

        await onProductoCreado();

        onCerrar();

        onProductoGuardado(
          "Producto creado correctamente.",
        );
      }
    } catch (error) {
      console.error(
        "Error al guardar producto:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-agregar-producto">

        <div className="modal-header">
          <div>
            <h2>
              {modoEdicion
                ? "Editar producto"
                : "Agregar producto"}
            </h2>

            <p>
              {modoEdicion
                ? "Modifica la información del producto."
                : "Registra un nuevo producto en el inventario."}
            </p>
          </div>

          <button
            type="button"
            className="modal-cerrar"
            onClick={onCerrar}
            disabled={guardando}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-formulario">

            {error && (
              <div className="modal-error">
                {error}
              </div>
            )}

            <div className="campo">
              <label>
                Nombre del producto
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                placeholder="Ej. Cuaderno Norma"
                required
              />
            </div>

            <div className="campo">
              <label>
                Descripción
              </label>

              <textarea
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(e.target.value)
                }
                placeholder="Descripción del producto"
                rows={3}
              />
            </div>

            <div className="campos-doble">
              <div className="campo">
                <label>
                  Precio de compra
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioCompra}
                  onChange={(e) =>
                    setPrecioCompra(e.target.value)
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="campo">
                <label>
                  Precio de venta
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precio}
                  onChange={(e) =>
                    setPrecio(e.target.value)
                  }
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="campos-doble">
              <div className="campo">
                <label>
                  Stock actual
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  placeholder="0"
                  required
                />
              </div>

              <div className="campo">
                <label>
                  Stock mínimo
                </label>

                <input
                  type="number"
                  min="0"
                  value={stockMinimo}
                  onChange={(e) =>
                    setStockMinimo(e.target.value)
                  }
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {!modoEdicion && (
              <>
                <div className="campos-doble">

                  <div className="campo">
                    <label>
                      Categoría
                    </label>

                    <select
                      value={categoria}
                      onChange={(e) =>
                        setCategoria(e.target.value)
                      }
                      required
                      disabled={cargandoOpciones}
                    >
                      <option value="">
                        {cargandoOpciones
                          ? "Cargando categorías..."
                          : "Seleccionar categoría"}
                      </option>

                      {categorias.map((item) => (
                        <option
                          key={item.idCategoria}
                          value={item.idCategoria}
                        >
                          {item.nombre}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarNuevaCategoria(
                          !mostrarNuevaCategoria,
                        )
                      }
                      disabled={guardando}
                    >
                      {mostrarNuevaCategoria
                        ? "Cancelar"
                        : "+ Nueva categoría"}
                    </button>
                  </div>

                  <div className="campo">
                    <label>
                      Proveedor
                    </label>

                    <select
                      value={proveedor}
                      onChange={(e) =>
                        setProveedor(e.target.value)
                      }
                      disabled={cargandoOpciones}
                    >
                      <option value="">
                        {cargandoOpciones
                          ? "Cargando proveedores..."
                          : "Seleccionar proveedor"}
                      </option>

                      {proveedores.map((item) => (
                        <option
                          key={item.idProveedor}
                          value={item.idProveedor}
                        >
                          {item.nombre} - {item.nit}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarNuevoProveedor(
                          !mostrarNuevoProveedor,
                        )
                      }
                      disabled={guardando}
                    >
                      {mostrarNuevoProveedor
                        ? "Cancelar"
                        : "+ Nuevo proveedor"}
                    </button>
                  </div>

                </div>

                {mostrarNuevaCategoria && (
                  <div className="campo">
                    <label>
                      Nueva categoría
                    </label>

                    <input
                      type="text"
                      value={nombreNuevaCategoria}
                      onChange={(e) =>
                        setNombreNuevaCategoria(
                          e.target.value,
                        )
                      }
                      placeholder="Nombre de la categoría"
                    />

                    <input
                      type="text"
                      value={descripcionNuevaCategoria}
                      onChange={(e) =>
                        setDescripcionNuevaCategoria(
                          e.target.value,
                        )
                      }
                      placeholder="Descripción (opcional)"
                    />

                    <button
                      type="button"
                      onClick={crearNuevaCategoria}
                      disabled={guardando}
                    >
                      {guardando
                        ? "Creando..."
                        : "Crear categoría"}
                    </button>
                  </div>
                )}

                {mostrarNuevoProveedor && (
                  <div className="campo">
                    <label>
                      Nuevo proveedor
                    </label>

                    <input
                      type="text"
                      value={nombreNuevoProveedor}
                      onChange={(e) =>
                        setNombreNuevoProveedor(
                          e.target.value,
                        )
                      }
                      placeholder="Nombre del proveedor"
                    />

                    <input
                      type="text"
                      value={nitNuevoProveedor}
                      onChange={(e) =>
                        setNitNuevoProveedor(
                          e.target.value,
                        )
                      }
                      placeholder="NIT del proveedor"
                    />

                    <button
                      type="button"
                      onClick={crearNuevoProveedor}
                      disabled={guardando}
                    >
                      {guardando
                        ? "Creando..."
                        : "Crear proveedor"}
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="campo">
              <label>
                Estado
              </label>

              <select
                value={estado}
                onChange={(e) =>
                  setEstado(e.target.value)
                }
              >
                <option value="activo">
                  Activo
                </option>

                <option value="inactivo">
                  Inactivo
                </option>

                <option value="agotado">
                  Agotado
                </option>

                <option value="descontinuado">
                  Descontinuado
                </option>
              </select>
            </div>

          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="boton-cancelar"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="boton-guardar"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : modoEdicion
                  ? "Guardar cambios"
                  : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarProducto;