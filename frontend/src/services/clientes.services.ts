import authService from "./auth.services";

import { BASE_URL } from "../config";

export type ClienteNuevo = {
  nombre: string;
  documento: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  ciudad?: string;
  segmento?: "minorista" | "mayorista" | "frecuente" | "nuevo";
};

export type Cliente = {
  idCliente: string;
  codigoCliente?: string | null;
  nombre: string;
  documento: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  ciudad?: string;
  segmento?: string;
};

type RespuestaClientes = {
  success: boolean;
  data: Cliente[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
};

let clientesCache: Cliente[] | null = null;
let clientesPromise: Promise<Cliente[]> | null = null;
let clientesVersion = 0;

function invalidarCacheClientes() {
  clientesCache = null;
  clientesPromise = null;
  clientesVersion++;
}

/*
 * CONTROL DEL REFRESH
 *
 * Evita varios refresh simultáneos cuando
 * varias peticiones reciben 401 al mismo tiempo.
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

const clienteService = {
  async crear(cliente: ClienteNuevo) {
    const response = await fetchConRefresh(
      `${BASE_URL}/clientes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Error al registrar el cliente."
      );
    }

    invalidarCacheClientes();

    return data;
  },

  async obtenerClientes(): Promise<Cliente[]> {
    if (clientesCache) {
      return clientesCache;
    }

    if (clientesPromise) {
      return clientesPromise;
    }

    const versionActual = clientesVersion;

    clientesPromise = (async () => {
      const response = await fetchConRefresh(
        `${BASE_URL}/clientes?limit=500`,
        {
          method: "GET",
        }
      );

      const data: RespuestaClientes =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Error al obtener los clientes."
        );
      }

      if (
        versionActual === clientesVersion
      ) {
        clientesCache = data.data;
      }

      return data.data;
    })();

    try {
      return await clientesPromise;
    } finally {
      clientesPromise = null;
    }
  },
};

export default clienteService;