import authService from "./auth.services";

import { BASE_URL } from "../config";

export type ProductoInventario = {
  idProducto: string;
  nombre: string;
  precio: number | string;
  stock: number;
};

type RespuestaProductos = {
  success: boolean;
  data: ProductoInventario[];
};

let productosCache: ProductoInventario[] | null = null;
let productosPromise: Promise<ProductoInventario[]> | null = null;
let productosVersion = 0;

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

async function obtenerProductos(): Promise<ProductoInventario[]> {
  if (productosCache) {
    return productosCache;
  }

  if (productosPromise) {
    return productosPromise;
  }

  const versionActual = productosVersion;

  productosPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/productos`,
      {
        method: "GET",
      }
    );

    const data: RespuestaProductos =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        "Error al obtener los productos."
      );
    }

    if (
      versionActual ===
      productosVersion
    ) {
      productosCache = data.data;
    }

    return data.data;
  })();

  try {
    return await productosPromise;
  } finally {
    productosPromise = null;
  }
}

async function obtenerValorInventario(): Promise<number> {
  const productos = await obtenerProductos();

  const valorTotal = productos.reduce(
    (total, producto) => {
      return (
        total +
        Number(producto.precio) *
          Number(producto.stock)
      );
    },
    0
  );

  return valorTotal;
}

const inventarioService = {
  obtenerProductos,
  obtenerValorInventario,
};

export default inventarioService;