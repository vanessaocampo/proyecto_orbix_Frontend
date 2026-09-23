import authService from "./auth.services";

import { BASE_URL } from "../config";

export type Categoria = {
  idCategoria: string;
  nombre: string;
  descripcion?: string | null;
};

export type RespuestaApi = {
  success: boolean;
  data: Categoria[];
  message?: string;
};

let categoriasCache: Categoria[] | null = null;
let categoriasPromise: Promise<Categoria[]> | null = null;
let categoriasVersion = 0;

function invalidarCacheCategorias() {
  categoriasCache = null;
  categoriasPromise = null;
  categoriasVersion++;
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

async function obtenerCategorias(): Promise<Categoria[]> {
  if (categoriasCache) {
    return categoriasCache;
  }

  if (categoriasPromise) {
    return categoriasPromise;
  }

  const versionActual = categoriasVersion;

  categoriasPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/categorias?limit=500`,
      {
        method: "GET",
      }
    );

    const data: RespuestaApi =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Error al obtener las categorías."
      );
    }

    if (
      versionActual ===
      categoriasVersion
    ) {
      categoriasCache = data.data;
    }

    return data.data;
  })();

  try {
    return await categoriasPromise;
  } finally {
    categoriasPromise = null;
  }
}

async function crearCategoria(
  nombre: string,
  descripcion?: string
): Promise<Categoria> {
  const response = await fetchConRefresh(
    `${BASE_URL}/categorias`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        descripcion: descripcion || null,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Error al crear la categoría."
    );
  }

  invalidarCacheCategorias();

  return data.data;
}

const categoriasService = {
  obtenerCategorias,
  crearCategoria,
};

export default categoriasService;