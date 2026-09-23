import authService from "./auth.services";

import { BASE_URL } from "../config";

export type Venta = {
  idVenta: string;
  codigoVenta: string;
  fecha: string;
  estado: string;
  metodoPago: string;
  total: number | string;

  cliente: {
    idCliente: string;
    nombre: string;
    documento: string;
  };

  usuario: {
    idUsuario: string;
    nombre: string;
    correo: string;
  };

  detalles: {
    idProducto: string;
    cantidad: number;
    precioUnitario: number | string;
    subtotal: number | string;

    producto: {
      idProducto: string;
      nombre: string;
    };
  }[];
};

export type CrearVentaData = {
  idCliente: string;
  estado?: string;
  metodoPago?: string;

  items: {
    idProducto: string;
    cantidad: number;
    precioUnitario?: number;
  }[];
};

type RespuestaVentas = {
  success: boolean;
  data: Venta[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type RespuestaVenta = {
  success: boolean;
  data: Venta;
};

/*
 * CACHE DE VENTAS
 */

let ventasCache: Venta[] | null = null;

let ventasPromise:
  | Promise<Venta[]>
  | null = null;

let ventasVersion = 0;

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

function invalidarCacheVentas() {
  ventasCache = null;
  ventasPromise = null;
  ventasVersion++;
}

/*
 * OBTENER TODAS LAS VENTAS
 */

async function obtenerVentas(): Promise<Venta[]> {
  /*
   * Si ya tenemos las ventas,
   * no hacemos otra petición.
   */
  if (ventasCache) {
    return ventasCache;
  }

  /*
   * Si ya hay una petición en curso,
   * reutilizamos esa misma petición.
   */
  if (ventasPromise) {
    return ventasPromise;
  }

  const versionActual =
    ventasVersion;

  ventasPromise = (async () => {
    const response =
      await fetchConRefresh(
        `${BASE_URL}/ventas?limit=500`,
        {
          method: "GET",
        }
      );

    const data: RespuestaVentas =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        "Error al obtener las ventas."
      );
    }

    /*
     * Solo guardamos la respuesta
     * si sigue siendo la versión actual.
     */
    if (
      versionActual ===
      ventasVersion
    ) {
      ventasCache = data.data;
    }

    return data.data;
  })();

  try {
    return await ventasPromise;
  } finally {
    ventasPromise = null;
  }
}

/*
 * OBTENER VENTA POR ID
 */

async function obtenerVentaPorId(
  idVenta: string
): Promise<Venta> {
  const response =
    await fetchConRefresh(
      `${BASE_URL}/ventas/${idVenta}`,
      {
        method: "GET",
      }
    );

  const data: RespuestaVenta =
    await response.json();

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      "Error al obtener la venta."
    );
  }

  return data.data;
}

/*
 * CREAR VENTA
 */

async function crearVenta(
  venta: CrearVentaData
): Promise<Venta> {
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

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Error al crear la venta."
    );
  }

  /*
   * La lista de ventas cambió.
   * Limpiamos el cache.
   */
  invalidarCacheVentas();

  return data.data;
}

const ventasService = {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
};

export default ventasService;