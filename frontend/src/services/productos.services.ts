import authService from "./auth.services";

import { BASE_URL } from "../config";

export type ProductoInventario = {
  idProducto: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precio: number;
  stock: number;
  stockMinimo: number;
  estado: string;
  categoria: string;
  proveedor: string;
};

type ProductoApi = {
  idProducto: string;
  sku?: string | null;
  nombre: string;
  descripcion?: string | null;
  precioCompra: number | string;
  precio: number | string;
  stock: number;
  stockMinimo: number;
  estado: string;
  categoria?: {
    idCategoria: string;
    nombre: string;
  };
  proveedor?: {
    idProveedor: string;
    nombre: string;
    nit: string;
  } | null;
};

type RespuestaApi = {
  success: boolean;
  data: ProductoApi[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CrearProducto = {
  sku?: string;
  nombre: string;
  descripcion?: string;
  precioCompra?: number;
  precio: number;
  stock?: number;
  stockMinimo?: number;
  estado?: "activo" | "inactivo" | "agotado" | "descontinuado";
  idCategoria: string;
  idProveedor?: string | null;
};

export type ActualizarProducto = {
  sku?: string;
  nombre?: string;
  descripcion?: string;
  precioCompra?: number;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  estado?: "activo" | "inactivo" | "agotado" | "descontinuado";
  idCategoria?: string;
  idProveedor?: string | null;
};

/*
 * CACHE DE PRODUCTOS
 */

let productosCache: ProductoInventario[] | null = null;

let productosPromise:
  | Promise<ProductoInventario[]>
  | null = null;

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

/*
 * INVALIDAR CACHE
 */

function invalidarCacheProductos() {
  productosCache = null;
  productosPromise = null;
  productosVersion++;
}

/*
 * OBTENER PRODUCTOS
 */

async function obtenerProductos(): Promise<ProductoInventario[]> {
  /*
   * Si ya tenemos los productos,
   * no hacemos otra petición.
   */
  if (productosCache) {
    return productosCache;
  }

  /*
   * Si ya hay una petición en curso,
   * reutilizamos esa misma petición.
   */
  if (productosPromise) {
    return productosPromise;
  }

  const versionActual = productosVersion;

  productosPromise = (async () => {
    const response = await fetchConRefresh(
      `${BASE_URL}/productos?limit=500`,
      {
        method: "GET",
      }
    );

    const data: RespuestaApi =
      await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        "Error al obtener los productos."
      );
    }

    const productos = data.data.map(
      (producto) => ({
        idProducto:
          producto.idProducto,

        codigo:
          producto.sku ??
          "Sin código",

        nombre:
          producto.nombre,

        descripcion:
          producto.descripcion ??
          "",

        precioCompra:
          Number(
            producto.precioCompra
          ),

        precio:
          Number(
            producto.precio
          ),

        stock:
          Number(
            producto.stock
          ),

        stockMinimo:
          Number(
            producto.stockMinimo
          ),

        estado:
          producto.estado,

        categoria:
          producto.categoria?.nombre ??
          "Sin categoría",

        proveedor:
          producto.proveedor?.nombre ??
          "Sin proveedor",
      })
    );

    /*
     * Solo guardamos la respuesta
     * si sigue siendo la versión actual.
     */
    if (
      versionActual ===
      productosVersion
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

/*
 * CREAR PRODUCTO
 */

async function crearProducto(
  producto: CrearProducto,
): Promise<ProductoApi> {
  const response = await fetchConRefresh(
    `${BASE_URL}/productos`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        producto
      ),
    },
  );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Error al crear el producto.",
    );
  }

  /*
   * El producto cambió.
   * Limpiamos el cache.
   */
  invalidarCacheProductos();

  return data.data;
}

/*
 * ELIMINAR PRODUCTO
 */

async function eliminarProducto(
  idProducto: string,
): Promise<void> {
  const response =
    await fetchConRefresh(
      `${BASE_URL}/productos/${idProducto}`,
      {
        method: "DELETE",
      },
    );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      data?.message ||
        "Error al eliminar el producto.",
    );
  }

  /*
   * El producto cambió.
   * Limpiamos el cache.
   */
  invalidarCacheProductos();
}

/*
 * ACTUALIZAR PRODUCTO
 */

async function actualizarProducto(
  idProducto: string,
  producto: ActualizarProducto,
): Promise<ProductoApi> {
  const response =
    await fetchConRefresh(
      `${BASE_URL}/productos/${idProducto}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          producto
        ),
      },
    );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ||
        "Error al actualizar el producto.",
    );
  }

  /*
   * El producto cambió.
   * Limpiamos el cache.
   */
  invalidarCacheProductos();

  return data.data;
}

const productosService = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};

export default productosService;