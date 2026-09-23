import authService from "./auth.services";

import type {
  ClienteVendedor,
  EstadoVenta,
  ProductoVendedor,
  VentaVendedor,
} from "../data/mockDataVendedor";

import { BASE_URL } from "../config";

const MAPA_ESTADO: Record<string, EstadoVenta> = {
  pendiente: "Pendiente",
  en_proceso: "Pendiente",
  completada: "Confirmada",
  cancelada: "Anulada",
  devuelta: "Anulada",
};

export const MAPA_ESTADO_INVERSO: Record<
  EstadoVenta,
  NonNullable<VentaNueva["estado"]>
> = {
  Pendiente: "pendiente",
  Confirmada: "completada",
  Anulada: "cancelada",
};

const MAPA_PAGO: Record<string, VentaVendedor["pago"]> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

const formatearFecha = (fecha?: string) => {
  if (!fecha) return "—";

  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

type RespuestaApi<T> = {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

let productosCache: ProductoVendedor[] | null = null;
let productosPromise: Promise<ProductoVendedor[] | null> | null = null;

let clientesCache: ClienteVendedor[] | null = null;
let clientesPromise: Promise<ClienteVendedor[] | null> | null = null;

let ventasCache: VentaVendedor[] | null = null;
let ventasPromise: Promise<VentaVendedor[] | null> | null = null;

let vendedorVersion = 0;

/*
 * CONTROL DEL REFRESH
 *
 * Evita que varias peticiones que reciban
 * 401 al mismo tiempo hagan varios refresh.
 */

let refreshPromise: Promise<void> | null = null;

/*
 * RENOVAR SESIÓN
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
 * Hace la petición normalmente.
 * Si recibe 401, renueva la sesión y
 * vuelve a intentar una sola vez.
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

function invalidarCacheVendedor() {
  productosCache = null;
  productosPromise = null;

  clientesCache = null;
  clientesPromise = null;

  ventasCache = null;
  ventasPromise = null;

  vendedorVersion++;
}

const traer = async <T,>(
  ruta: string
): Promise<T | null> => {
  try {
    const response = await fetchConRefresh(
      `${BASE_URL}${ruta}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) return null;

    const body =
      (await response.json()) as RespuestaApi<T>;

    return body.success ? body.data : null;
  } catch {
    return null;
  }
};

async function obtenerProductos(): Promise<
  ProductoVendedor[] | null
> {
  if (productosCache) {
    return productosCache;
  }

  if (productosPromise) {
    return productosPromise;
  }

  const versionActual = vendedorVersion;

  productosPromise = (async () => {
    const items =
      await traer<Array<Record<string, unknown>>>(
        "/productos?limit=500"
      );

    if (!items) return null;

    const productos = items.map((producto) => ({
      id: String(
        producto.sku &&
          producto.sku !== ""
          ? producto.sku
          : `PRD-${String(
              producto.idProducto ?? ""
            ).slice(0, 8)}`
      ),
      idProducto: String(
        producto.idProducto ?? ""
      ),
      nombre: String(
        producto.nombre ?? "Producto"
      ),
      categoria:
        (
          producto.categoria as
            | { nombre?: string }
            | undefined
        )?.nombre ?? "General",
      precio: Number(
        producto.precio ?? 0
      ),
      stock: Number(
        producto.stock ?? 0
      ),
      minStock: Number(
        producto.stockMinimo ?? 0
      ),
    }));

    if (
      versionActual ===
      vendedorVersion
    ) {
      productosCache = productos;
    }

    return productos;
  })();

  try {
    return await productosPromise;
  } finally {
    productosPromise = null;
  }
}

async function obtenerClientes(): Promise<
  ClienteVendedor[] | null
> {
  if (clientesCache) {
    return clientesCache;
  }

  if (clientesPromise) {
    return clientesPromise;
  }

  const versionActual = vendedorVersion;

  clientesPromise = (async () => {
    const items =
      await traer<Array<Record<string, unknown>>>(
        "/clientes?limit=500"
      );

    if (!items) return null;

    const clientes = items.map(
      (cliente) => ({
        id: String(
          cliente.idCliente ?? ""
        ),
        idCliente: String(
          cliente.idCliente ?? ""
        ),
        codigoCliente:
          cliente.codigoCliente
            ? String(
                cliente.codigoCliente
              )
            : undefined,
        nombre: String(
          cliente.nombre ?? "Cliente"
        ),
        ciudad: String(
          cliente.ciudad ?? "—"
        ),
        totalCompras: 0,
        pedidos: 0,
        ultimo: "—",
      })
    );

    if (
      versionActual ===
      vendedorVersion
    ) {
      clientesCache = clientes;
    }

    return clientes;
  })();

  try {
    return await clientesPromise;
  } finally {
    clientesPromise = null;
  }
}

async function obtenerVentas(): Promise<
  VentaVendedor[] | null
> {
  if (ventasCache) {
    return ventasCache;
  }

  if (ventasPromise) {
    return ventasPromise;
  }

  const versionActual = vendedorVersion;

  ventasPromise = (async () => {
    const items =
      await traer<Array<Record<string, unknown>>>(
        "/ventas?limit=500"
      );

    if (!items) return null;

    const ventas = items.map((venta) => {
      const detalles =
        venta.detalles as
          | Array<{
              cantidad: number;
              precioUnitario: number;
              producto: {
                idProducto: string;
                nombre: string;
              };
            }>
          | undefined;

      const cantidadItems =
        detalles?.reduce(
          (acumulado, detalle) =>
            acumulado +
            Number(
              detalle.cantidad
            ),
          0
        ) ?? 0;

      return {
        id: `ORD-${String(
          venta.idVenta ?? ""
        )}`,
        idVenta: String(
          venta.idVenta ?? ""
        ),
        codigoVenta:
          venta.codigoVenta
            ? String(
                venta.codigoVenta
              )
            : undefined,
        idCliente: String(
          (
            venta.cliente as
              | {
                  idCliente?: string;
                }
              | undefined
          )?.idCliente ?? ""
        ),
        cliente:
          (
            venta.cliente as
              | {
                  nombre?: string;
                }
              | undefined
          )?.nombre ??
          "Cliente",
        monto: Number(
          venta.total ?? 0
        ),
        estado:
          MAPA_ESTADO[
            String(venta.estado)
          ] ?? "Pendiente",
        fecha: formatearFecha(
          String(venta.fecha)
        ),
        fechaISO: String(
          venta.fecha ?? ""
        ),
        items: cantidadItems,
        pago:
          MAPA_PAGO[
            String(
              venta.metodoPago
            )
          ] ?? "Efectivo",
        metodoPago:
          (venta.metodoPago as VentaVendedor["metodoPago"]) ??
          "efectivo",
        itemsDetalle:
          detalles?.map(
            (detalle) => ({
              idProducto: String(
                detalle.producto
                  .idProducto ?? ""
              ),
              nombre:
                detalle.producto
                  .nombre,
              cantidad: Number(
                detalle.cantidad
              ),
              precioUnitario:
                Number(
                  detalle.precioUnitario ??
                    0
                ),
            })
          ),
      };
    });

    if (
      versionActual ===
      vendedorVersion
    ) {
      ventasCache = ventas;
    }

    return ventas;
  })();

  try {
    return await ventasPromise;
  } finally {
    ventasPromise = null;
  }
}

export type VentaNueva = {
  idCliente: string;
  estado?:
    | "pendiente"
    | "en_proceso"
    | "completada"
    | "cancelada"
    | "devuelta";
  metodoPago?:
    | "efectivo"
    | "tarjeta"
    | "transferencia";
  items: {
    idProducto: string;
    cantidad: number;
    precioUnitario?: number;
  }[];
};

async function crearVenta(
  venta: VentaNueva
) {
  const response =
    await fetchConRefresh(
      `${BASE_URL}/ventas`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          venta
        ),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Error al registrar la venta."
    );
  }

  invalidarCacheVendedor();

  return data;
}

async function actualizarEstadoVenta(
  idVenta: string,
  estado: NonNullable<
    VentaNueva["estado"]
  >
) {
  const response =
    await fetchConRefresh(
      `${BASE_URL}/ventas/${idVenta}/estado`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          estado,
        }),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Error al actualizar el estado."
    );
  }

  invalidarCacheVendedor();

  return data;
}

const idVentaDe = (id: string) =>
  id.replace("ORD-", "");

const vendedorService = {
  obtenerProductos,
  obtenerClientes,
  obtenerVentas,
  crearVenta,
  actualizarEstadoVenta,
  idVentaDe,
};

export default vendedorService;