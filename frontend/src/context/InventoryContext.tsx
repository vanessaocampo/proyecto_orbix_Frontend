import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import authService from "../services/auth.services";
import { BASE_URL } from "../config";

export type Producto = {
  id: string;
  dbId?: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precioCompra?: number;
  precio: number;
  stock: number;
  stockMin: number;
  valor: number;
  proveedor: string;
};

export type Movimiento = {
  id: string;
  fecha: string;
  hora: string;
  tipo: string;
  producto: string;
  sku: string;
  cantidad: string;
  isPositive: boolean;
  valor: number;
  responsable: string;
  nota: string;
};

interface InventoryContextType {
  productos: Producto[];
  movimientos: Movimiento[];
  loading: boolean;
  agregarProducto: (prod: Producto) => void;
  modificarProducto: (prod: Producto) => void;
  registrarMovimiento: (
    mov: Movimiento,
    sku: string,
    cantidadNum: number,
    tipo: string
  ) => void;
}

const InventoryContext = createContext<
  InventoryContextType | undefined
>(undefined);

let refreshPromise: Promise<void> | null = null;

/*
 * RENOVAR SESIÓN
 *
 * Evita varios refresh simultáneos cuando
 * varias peticiones reciben 401 al mismo tiempo.
 */

async function renovarSesion(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        await authService.refresh();
      } catch {
        window.location.href = "/login/admin";
        throw new Error("Sesión expirada.");
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

/*
 * FETCH CON REFRESH AUTOMÁTICO
 *
 * Si la petición recibe 401, renueva la sesión
 * y vuelve a intentar la petición una sola vez.
 */

async function fetchConRefresh(
  url: string,
  options: RequestInit = {},
  reintento = false
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (
    response.status !== 401 ||
    reintento
  ) {
    return response;
  }

  await renovarSesion();

  return fetchConRefresh(
    url,
    options,
    true
  );
}

export const InventoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [productos, setProductos] = useState<Producto[]>(
    []
  );
  const [movimientos, setMovimientos] = useState<
    Movimiento[]
  >([]);

  // Estado para saber si los datos están cargando
  const [loading, setLoading] = useState(false);
  const [defaultCatId, setDefaultCatId] = useState<
    string | undefined
  >();
  const [defaultProvId, setDefaultProvId] = useState<
    string | undefined
  >();

  // Cargar datos reales de la BD al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);

      try {
        // 0. Cargar categorías y proveedores
        const [resCat, resProv] = await Promise.all([
          fetchConRefresh(
            `${BASE_URL}/categorias`
          ),
          fetchConRefresh(
            `${BASE_URL}/proveedores`
          ),
        ]);

        if (resCat.ok) {
          const d = await resCat.json();

          if (d.data?.length > 0) {
            setDefaultCatId(
              d.data[0].idCategoria
            );
          }
        }

        if (resProv.ok) {
          const d = await resProv.json();

          if (d.data?.length > 0) {
            setDefaultProvId(
              d.data[0].idProveedor
            );
          }
        }

        // 1. Cargar productos reales
        const resProd = await fetchConRefresh(
          `${BASE_URL}/productos`
        );

        if (resProd.ok) {
          const dataProd = await resProd.json();

          if (
            dataProd.success &&
            dataProd.data.length > 0
          ) {
            const prodMapeados: Producto[] =
              dataProd.data.map((p: any) => ({
                id:
                  p.sku ||
                  `PRD-${p.idProducto.substring(0, 6)}`,
                dbId: p.idProducto,
                nombre: p.nombre,
                categoria:
                  p.categoria?.nombre || "General",
                descripcion: p.descripcion,
                precioCompra: p.precioCompra
                  ? Number(p.precioCompra)
                  : undefined,
                precio: Number(p.precio),
                stock: p.stock,
                stockMin: p.stockMinimo,
                valor:
                  Number(p.precio) * p.stock,
                proveedor:
                  p.proveedor?.nombre || "Local",
              }));

            setProductos(prodMapeados);
          }
        }

        // 2. Cargar movimientos reales
        const resMov = await fetchConRefresh(
          `${BASE_URL}/inventario/movimientos`
        );

        if (resMov.ok) {
          const dataMov = await resMov.json();

          if (
            dataMov.success &&
            dataMov.data.length > 0
          ) {
            const movMapeados: Movimiento[] =
              dataMov.data.map((m: any) => {
                const dateObj = new Date(m.fecha);

                return {
                  id:
                    m.codigoMovimiento ||
                    `MOV-${m.idMovimiento.substring(0, 8)}`,
                  fecha:
                    dateObj.toLocaleDateString(),
                  hora:
                    dateObj.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  tipo:
                    m.tipo === "entrada"
                      ? "Entrada"
                      : m.tipo === "salida"
                        ? "Salida"
                        : m.tipo === "ajuste"
                          ? "Ajuste"
                          : "Devolucion",
                  producto:
                    m.producto?.nombre ||
                    "Desconocido",
                  sku:
                    m.producto?.sku || "N/A",
                  cantidad:
                    (
                      m.tipo === "entrada" ||
                      m.tipo === "devolucion"
                        ? "+"
                        : "-"
                    ) +
                    m.cantidad +
                    " u.",
                  isPositive:
                    m.tipo === "entrada" ||
                    m.tipo === "devolucion",
                  valor:
                    m.cantidad *
                    Number(
                      m.producto?.precio || 0
                    ),
                  responsable:
                    m.usuario?.nombre || "Sistema",
                  nota:
                    m.referencia || "N/A",
                };
              });

            setMovimientos(movMapeados);
          }
        }
      } catch (error) {
        console.error(
          "No se pudo conectar con la BD o la sesión caducó."
        );

        setProductos([]);
        setMovimientos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const agregarProducto = async (
    prod: Producto
  ) => {
    // 1. Actualización UI inmediata
    setProductos((prev) => [prod, ...prev]);

    // 2. Sincronización con Base de Datos
    try {
      const payload = {
        sku: prod.id,
        nombre: prod.nombre,
        descripcion: prod.descripcion || null,
        precioCompra: prod.precioCompra || 0,
        precio: prod.precio,
        stock: prod.stock,
        stockMinimo: prod.stockMin,
        idCategoria: defaultCatId,
        idProveedor: defaultProvId,
      };

      await fetchConRefresh(
        `${BASE_URL}/productos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (e) {
      console.error(
        "Error al guardar el producto en la BD",
        e
      );
    }
  };

  const modificarProducto = async (
    prod: Producto
  ) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === prod.id ? prod : p
      )
    );

    try {
      if (prod.dbId) {
        const payload = {
          sku: prod.id,
          nombre: prod.nombre,
          descripcion: prod.descripcion || null,
          precioCompra: prod.precioCompra || 0,
          precio: prod.precio,
          stock: prod.stock,
          stockMinimo: prod.stockMin,
        };

        await fetchConRefresh(
          `${BASE_URL}/productos/${prod.dbId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }
    } catch (e) {
      console.error(
        "Error al modificar el producto en la BD",
        e
      );
    }
  };

  const registrarMovimiento = async (
    mov: Movimiento,
    sku: string,
    cantidadNum: number,
    tipo: string
  ) => {
    setMovimientos((prev) => [mov, ...prev]);

    // Actualizar stock del producto asociado localmente
    let prodEncontrado: Producto | undefined;

    setProductos((prev) =>
      prev.map((p) => {
        if (
          p.id === sku ||
          p.nombre.toLowerCase() ===
            mov.producto.toLowerCase()
        ) {
          prodEncontrado = p;

          const nuevoStock =
            tipo === "Entrada"
              ? p.stock + cantidadNum
              : p.stock - cantidadNum;

          return {
            ...p,
            stock: Math.max(0, nuevoStock),
            valor:
              Math.max(0, nuevoStock) *
              p.precio,
          };
        }

        return p;
      })
    );

    // Sincronizar con la BD
    try {
      if (
        prodEncontrado &&
        prodEncontrado.dbId
      ) {
        const rawId =
          prodEncontrado.id.replace(
            "PRD-",
            ""
          );

        const idProducto =
          parseInt(rawId) || 1;

        const endpointTipo =
          tipo.toLowerCase() === "entrada"
            ? "entrada"
            : tipo.toLowerCase() === "salida"
              ? "salida"
              : "ajuste";

        await fetchConRefresh(
          `${BASE_URL}/inventario/${endpointTipo}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idProducto,
              cantidad: cantidadNum,
              referencia:
                mov.nota ||
                "Registrado desde Dashboard",
            }),
          }
        );
      }
    } catch (e) {
      console.error(
        "Error al guardar el movimiento en la BD",
        e
      );
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        productos,
        movimientos,
        agregarProducto,
        modificarProducto,
        registrarMovimiento,
        loading,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(
    InventoryContext
  );

  if (!context) {
    throw new Error(
      "useInventory must be used within an InventoryProvider"
    );
  }

  return context;
};