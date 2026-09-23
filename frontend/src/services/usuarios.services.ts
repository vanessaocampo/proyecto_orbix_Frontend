import authService from "./auth.services";

import { BASE_URL } from "../config";

export interface CrearUsuario {
  nombre: string;
  correo: string;
  correoPersonal?: string;
  password: string;

  codigoEmpleado?: string;
  celular?: string;
  ciudad?: string;
  fechaIngreso?: string;

  rol?:
    | "admin"
    | "vendedor"
    | "inventario"
    | "consulta";

  estado?:
    | "activo"
    | "inactivo";
}

export interface EditarUsuario {
  nombre?: string;
  correo?: string;
  correoPersonal?: string;
  password?: string;

  codigoEmpleado?: string;
  celular?: string;
  ciudad?: string;
  fechaIngreso?: string;

  rol?:
    | "admin"
    | "vendedor"
    | "inventario"
    | "consulta";

  estado?:
    | "activo"
    | "inactivo";
}

export interface Usuario {
  idUsuario: string;
  nombre: string;
  correo: string;
  correoPersonal?: string;

  codigoEmpleado?: string;
  celular?: string;
  ciudad?: string;
  fechaIngreso?: string;

  rol:
    | "admin"
    | "vendedor"
    | "inventario"
    | "consulta";

  estado:
    | "activo"
    | "inactivo";
}

/*
 * CACHE DE USUARIOS
 */

let usuariosCache: Usuario[] | null = null;

let usuariosPromise:
  | Promise<Usuario[]>
  | null = null;

let usuariosVersion = 0;

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

function invalidarCacheUsuarios() {
  usuariosCache = null;
  usuariosPromise = null;
  usuariosVersion++;
}

/*
 * OBTENER USUARIOS
 */

async function obtenerUsuarios(): Promise<Usuario[]> {
  /*
   * Si ya tenemos los usuarios,
   * no hacemos otra petición.
   */
  if (usuariosCache) {
    return usuariosCache;
  }

  /*
   * Si ya hay una petición en curso,
   * reutilizamos esa misma petición.
   */
  if (usuariosPromise) {
    return usuariosPromise;
  }

  const versionActual = usuariosVersion;

  usuariosPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/usuarios?limit=500`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Error al obtener los usuarios.",
      );
    }

    let usuarios: Usuario[] = [];

    if (Array.isArray(data.data)) {
      usuarios = data.data;
    } else if (
      data.data &&
      Array.isArray(data.data.items)
    ) {
      usuarios = data.data.items;
    }

    /*
     * Solo guardamos la respuesta
     * si sigue siendo la versión actual.
     */
    if (
      versionActual === usuariosVersion
    ) {
      usuariosCache = usuarios;
    }

    return usuarios;
  })();

  try {
    return await usuariosPromise;
  } finally {
    usuariosPromise = null;
  }
}

/*
 * OBTENER USUARIO POR ID
 */

async function obtenerUsuarioPorId(
  idUsuario: string,
): Promise<Usuario> {
  const response = await fetchConRefresh(
    `${BASE_URL}/usuarios/${idUsuario}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Error al obtener el usuario.",
    );
  }

  return data.data;
}

/*
 * CREAR USUARIO
 */

async function crearUsuario(
  usuario: CrearUsuario,
): Promise<Usuario> {
  const response = await fetchConRefresh(
    `${BASE_URL}/usuarios`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Error al crear el usuario.",
    );
  }

  /*
   * La lista de usuarios cambió.
   * Limpiamos el cache.
   */
  invalidarCacheUsuarios();

  return data.data;
}

/*
 * EDITAR USUARIO
 */

async function editarUsuario(
  idUsuario: string,
  usuario: EditarUsuario,
): Promise<Usuario> {
  const response = await fetchConRefresh(
    `${BASE_URL}/usuarios/${idUsuario}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Error al editar el usuario.",
    );
  }

  /*
   * La lista de usuarios cambió.
   * Limpiamos el cache.
   */
  invalidarCacheUsuarios();

  return data.data;
}

/*
 * ELIMINAR USUARIO
 */

async function eliminarUsuario(
  idUsuario: string,
): Promise<void> {
  const response = await fetchConRefresh(
    `${BASE_URL}/usuarios/${idUsuario}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    throw new Error(
      data?.message ||
        "Error al eliminar el usuario.",
    );
  }

  /*
   * La lista de usuarios cambió.
   * Limpiamos el cache.
   */
  invalidarCacheUsuarios();
}

const usuariosService = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
};

export default usuariosService;