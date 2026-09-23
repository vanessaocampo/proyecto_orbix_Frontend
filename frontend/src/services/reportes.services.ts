import authService from "./auth.services";

import { BASE_URL } from "../config";

/*
 * TIPOS
 */

export type ResumenReporte = {
  ventasCompletadas: number;
  ingresosTotales: number | string;
  ventasPendientes: number;
  productosAgotados: number;
  totalClientes: number;
  totalProductos: number;
};

export type VentaPorCategoria = {
  categoria: string;
  totalVendido: number | string;
};

export type UltimaVenta = {
  id_venta: string;
  fecha: string;
  total: number | string;
  estado: string;
  cliente: string;
  vendedor: string;
};

export type ProductoPorProveedor = {
  id_proveedor: string;
  proveedor: string;
  id_producto: string;
  producto: string;
  stock: number;
};

export type Reporte = {
  idReporte: string;
  nombre: string;
  tipo: string;
  parametros?: Record<string, unknown> | null;
  fechaGenerado: string;

  usuario?: {
    idUsuario: string;
    nombre: string;
  };
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

/*
 * CACHE
 */

let resumenCache: ResumenReporte | null = null;
let resumenPromise: Promise<ResumenReporte> | null = null;

let ventasPorCategoriaCache: VentaPorCategoria[] | null = null;
let ventasPorCategoriaPromise:
  | Promise<VentaPorCategoria[]>
  | null = null;

const ultimasVentasCache = new Map<number, UltimaVenta[]>();
const ultimasVentasPromises = new Map<
  number,
  Promise<UltimaVenta[]>
>();

let productosPorProveedorCache:
  | ProductoPorProveedor[]
  | null = null;

let productosPorProveedorPromise:
  | Promise<ProductoPorProveedor[]>
  | null = null;

let reportesCache: Reporte[] | null = null;
let reportesPromise: Promise<Reporte[]> | null = null;

let reportesVersion = 0;

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

/*
 * INVALIDAR CACHE
 */

function invalidarCacheReportes() {
  resumenCache = null;
  resumenPromise = null;

  ventasPorCategoriaCache = null;
  ventasPorCategoriaPromise = null;

  ultimasVentasCache.clear();
  ultimasVentasPromises.clear();

  productosPorProveedorCache = null;
  productosPorProveedorPromise = null;

  reportesCache = null;
  reportesPromise = null;

  reportesVersion++;
}

/*
 * RESUMEN GENERAL
 */

async function obtenerResumen(): Promise<ResumenReporte> {
  if (resumenCache) {
    return resumenCache;
  }

  if (resumenPromise) {
    return resumenPromise;
  }

  const versionActual = reportesVersion;

  resumenPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/reportes/resumen`,
      {
        method: "GET",
      }
    );

    const data: RespuestaApi<ResumenReporte> =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        "Error al obtener el resumen de reportes."
      );
    }

    if (versionActual === reportesVersion) {
      resumenCache = data.data;
    }

    return data.data;
  })();

  try {
    return await resumenPromise;
  } finally {
    resumenPromise = null;
  }
}

/*
 * VENTAS POR CATEGORÍA
 */

async function obtenerVentasPorCategoria(): Promise<
  VentaPorCategoria[]
> {
  if (ventasPorCategoriaCache) {
    return ventasPorCategoriaCache;
  }

  if (ventasPorCategoriaPromise) {
    return ventasPorCategoriaPromise;
  }

  const versionActual = reportesVersion;

  ventasPorCategoriaPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/reportes/ventas-por-categoria`,
      {
        method: "GET",
      }
    );

    const data: RespuestaApi<VentaPorCategoria[]> =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        "Error al obtener las ventas por categoría."
      );
    }

    const resultado = data.data.map((item) => ({
      categoria: item.categoria,
      totalVendido: Number(item.totalVendido),
    }));

    if (versionActual === reportesVersion) {
      ventasPorCategoriaCache = resultado;
    }

    return resultado;
  })();

  try {
    return await ventasPorCategoriaPromise;
  } finally {
    ventasPorCategoriaPromise = null;
  }
}

/*
 * ÚLTIMAS VENTAS
 */

async function obtenerUltimasVentas(
  limit = 10
): Promise<UltimaVenta[]> {
  const cache = ultimasVentasCache.get(limit);

  if (cache) {
    return cache;
  }

  const promise = ultimasVentasPromises.get(limit);

  if (promise) {
    return promise;
  }

  const versionActual = reportesVersion;

  const nuevaPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/reportes/ultimas-ventas?limit=${limit}`,
      {
        method: "GET",
      }
    );

    const data: RespuestaApi<UltimaVenta[]> =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        "Error al obtener las últimas ventas."
      );
    }

    const resultado = data.data.map((venta) => ({
      ...venta,
      total: Number(venta.total),
    }));

    if (versionActual === reportesVersion) {
      ultimasVentasCache.set(limit, resultado);
    }

    return resultado;
  })();

  ultimasVentasPromises.set(limit, nuevaPromise);

  try {
    return await nuevaPromise;
  } finally {
    ultimasVentasPromises.delete(limit);
  }
}

/*
 * PRODUCTOS POR PROVEEDOR
 */

async function obtenerProductosPorProveedor(): Promise<
  ProductoPorProveedor[]
> {
  if (productosPorProveedorCache) {
    return productosPorProveedorCache;
  }

  if (productosPorProveedorPromise) {
    return productosPorProveedorPromise;
  }

  const versionActual = reportesVersion;

  productosPorProveedorPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/reportes/productos-por-proveedor`,
      {
        method: "GET",
      }
    );

    const data: RespuestaApi<ProductoPorProveedor[]> =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        "Error al obtener los productos por proveedor."
      );
    }

    const resultado = data.data.map((producto) => ({
      ...producto,
      stock: Number(producto.stock),
    }));

    if (versionActual === reportesVersion) {
      productosPorProveedorCache = resultado;
    }

    return resultado;
  })();

  try {
    return await productosPorProveedorPromise;
  } finally {
    productosPorProveedorPromise = null;
  }
}

/*
 * REPORTES GUARDADOS
 */

async function obtenerReportes(): Promise<Reporte[]> {
  if (reportesCache) {
    return reportesCache;
  }

  if (reportesPromise) {
    return reportesPromise;
  }

  const versionActual = reportesVersion;

  reportesPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/reportes?limit=500`,
      {
        method: "GET",
      }
    );

    const data: RespuestaApi<Reporte[]> =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        "Error al obtener los reportes."
      );
    }

    if (versionActual === reportesVersion) {
      reportesCache = data.data;
    }

    return data.data;
  })();

  try {
    return await reportesPromise;
  } finally {
    reportesPromise = null;
  }
}

/*
 * OBTENER REPORTE POR ID
 */

async function obtenerReportePorId(
  idReporte: string
): Promise<Reporte> {
  const response = await fetchConRefresh(
    `${BASE_URL}/reportes/${idReporte}`,
    {
      method: "GET",
    }
  );

  const data: RespuestaApi<Reporte> =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      "Error al obtener el reporte."
    );
  }

  return data.data;
}

/*
 * CREAR REGISTRO DE REPORTE
 */

export type CrearReporte = {
  nombre: string;
  tipo: string;
  parametros?: Record<string, unknown> | null;
};

async function crearReporte(
  reporte: CrearReporte
): Promise<Reporte> {
  const response = await fetchConRefresh(
    `${BASE_URL}/reportes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reporte),
    }
  );

  const data: RespuestaApi<Reporte> =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      "Error al guardar el reporte."
    );
  }

  invalidarCacheReportes();

  return data.data;
}

/*
 * ELIMINAR REPORTE
 */

async function eliminarReporte(
  idReporte: string
): Promise<void> {
  const response = await fetchConRefresh(
    `${BASE_URL}/reportes/${idReporte}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.message ||
        "Error al eliminar el reporte."
    );
  }

  invalidarCacheReportes();
}

/*
 * EXPORTACIÓN DEL SERVICIO
 */

const reportesService = {
  obtenerResumen,
  obtenerVentasPorCategoria,
  obtenerUltimasVentas,
  obtenerProductosPorProveedor,
  obtenerReportes,
  obtenerReportePorId,
  crearReporte,
  eliminarReporte,
};

export default reportesService;