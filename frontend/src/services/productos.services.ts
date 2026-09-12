const BASE_URL = "http://localhost:3000/api/v1";

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

async function obtenerProductos(): Promise<ProductoInventario[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(`${BASE_URL}/productos?limit=500`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: RespuestaApi = await response.json();

  if (!response.ok || !data.success) {
    throw new Error("Error al obtener los productos.");
  }

  return data.data.map((producto) => ({
    // UUID interno del producto
    idProducto: producto.idProducto,

    // SKU que se muestra como código en la tabla
    codigo: producto.sku ?? "Sin código",

    nombre: producto.nombre,

    descripcion: producto.descripcion ?? "",

    precioCompra: Number(producto.precioCompra),

    precio: Number(producto.precio),

    stock: Number(producto.stock),

    stockMinimo: Number(producto.stockMinimo),

    estado: producto.estado,

    categoria: producto.categoria?.nombre ?? "Sin categoría",

    proveedor: producto.proveedor?.nombre ?? "Sin proveedor",
  }));
}

async function crearProducto(
  producto: CrearProducto,
): Promise<ProductoApi> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Error al crear el producto.",
    );
  }

  return data.data;
}

async function eliminarProducto(
  idProducto: string,
): Promise<void> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(
    `${BASE_URL}/productos/${idProducto}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message || "Error al eliminar el producto.",
    );
  }
}

async function actualizarProducto(
  idProducto: string,
  producto: ActualizarProducto,
): Promise<ProductoApi> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(
    `${BASE_URL}/productos/${idProducto}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(producto),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Error al actualizar el producto.",
    );
  }

  return data.data;
}

const productosService = {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};

export default productosService;