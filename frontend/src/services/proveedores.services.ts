import authService from "./auth.services";

import { BASE_URL } from "../config";

export type Proveedor = {
  idProveedor: string;
  nombre: string;
  nit: string;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  estado?: string;
};

export type RespuestaApi = {
  success: boolean;
  data: Proveedor[];
  message?: string;
};

let proveedoresCache: Proveedor[] | null = null;
let proveedoresPromise: Promise<Proveedor[]> | null = null;
let proveedoresVersion = 0;

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

function invalidarCacheProveedores() {
  proveedoresCache = null;
  proveedoresPromise = null;
  proveedoresVersion++;
}

async function obtenerProveedores(): Promise<Proveedor[]> {
  if (proveedoresCache) {
    return proveedoresCache;
  }

  if (proveedoresPromise) {
    return proveedoresPromise;
  }

  const versionActual = proveedoresVersion;

  proveedoresPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/proveedores?limit=500`,
      {
        method: "GET",
      }
    );

    const data: RespuestaApi =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Error al obtener los proveedores."
      );
    }

    if (
      versionActual ===
      proveedoresVersion
    ) {
      proveedoresCache = data.data;
    }

    return data.data;
  })();

  try {
    return await proveedoresPromise;
  } finally {
    proveedoresPromise = null;
  }
}

async function crearProveedor(
  nombre: string,
  nit: string,
  telefono?: string,
  correo?: string,
  direccion?: string,
  ciudad?: string,
  estado?: string
): Promise<Proveedor> {
  const response =
    await fetchConRefresh(
      `${BASE_URL}/proveedores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          nit,
          telefono: telefono || null,
          correo: correo || null,
          direccion: direccion || null,
          ciudad: ciudad || null,
          estado: estado || undefined,
        }),
      }
    );

  const data =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Error al crear el proveedor."
    );
  }

  invalidarCacheProveedores();

  return data.data;
}

async function actualizarProveedor(
  idProveedor: string,
  nombre: string,
  nit: string,
  telefono?: string,
  correo?: string,
  direccion?: string,
  ciudad?: string,
  estado?: string
): Promise<Proveedor> {
  const response =
    await fetchConRefresh(
      `${BASE_URL}/proveedores/${idProveedor}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          nit,
          telefono: telefono || null,
          correo: correo || null,
          direccion: direccion || null,
          ciudad: ciudad || null,
          estado: estado || undefined,
        }),
      }
    );

  const data =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Error al actualizar el proveedor."
    );
  }

  invalidarCacheProveedores();

  return data.data;
}

const proveedoresService = {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
};

export default proveedoresService;