import type {
  ClienteVendedor,
  EstadoVenta,
  ProductoVendedor,
  VentaVendedor,
} from "../data/mockDataVendedor";

const BASE_URL = "http://localhost:3000/api/v1";

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
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

const traer = async <T,>(ruta: string): Promise<T | null> => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const response = await fetch(`${BASE_URL}${ruta}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;

    const body = (await response.json()) as RespuestaApi<T>;

    return body.success ? body.data : null;
  } catch {
    return null;
  }
};

async function obtenerProductos(): Promise<ProductoVendedor[] | null> {
  const items = await traer<Array<Record<string, unknown>>>("/productos?limit=500");
  if (!items) return null;

  return items.map((producto) => ({
    id: String(
      producto.sku && producto.sku !== ""
        ? producto.sku
        : `PRD-${String(producto.idProducto ?? "").slice(0, 8)}`,
    ),
    idProducto: String(producto.idProducto ?? ""),
    nombre: String(producto.nombre ?? "Producto"),
    categoria:
      (producto.categoria as { nombre?: string } | undefined)?.nombre ?? "General",
    precio: Number(producto.precio ?? 0),
    stock: Number(producto.stock ?? 0),
    minStock: Number(producto.stockMinimo ?? 0),
  }));
}

async function obtenerClientes(): Promise<ClienteVendedor[] | null> {
  const items = await traer<Array<Record<string, unknown>>>("/clientes?limit=500");
  if (!items) return null;

  return items.map((cliente) => ({
    id: String(cliente.idCliente ?? ""),
    idCliente: String(cliente.idCliente ?? ""),
    codigoCliente: cliente.codigoCliente
      ? String(cliente.codigoCliente)
      : undefined,
    nombre: String(cliente.nombre ?? "Cliente"),
    ciudad: String(cliente.ciudad ?? "—"),
    totalCompras: 0,
    pedidos: 0,
    ultimo: "—",
  }));
}

async function obtenerVentas(): Promise<VentaVendedor[] | null> {
  const items = await traer<Array<Record<string, unknown>>>("/ventas?limit=500");
  if (!items) return null;

  return items.map((venta) => {
    const detalles = venta.detalles as
      | Array<{
          cantidad: number;
          precioUnitario: number;
          producto: { idProducto: string; nombre: string };
        }>
      | undefined;

    const cantidadItems =
      detalles?.reduce((acumulado, detalle) => acumulado + Number(detalle.cantidad), 0) ??
      0;

    return {
      id: `ORD-${String(venta.idVenta ?? "")}`,
      idVenta: String(venta.idVenta ?? ""),
      codigoVenta: venta.codigoVenta ? String(venta.codigoVenta) : undefined,
      idCliente: String(
        (venta.cliente as { idCliente?: string } | undefined)?.idCliente ?? "",
      ),
      cliente: (venta.cliente as { nombre?: string } | undefined)?.nombre ?? "Cliente",
      monto: Number(venta.total ?? 0),
      estado: MAPA_ESTADO[String(venta.estado)] ?? "Pendiente",
      fecha: formatearFecha(String(venta.fecha)),
      fechaISO: String(venta.fecha ?? ""),
      items: cantidadItems,
      pago: MAPA_PAGO[String(venta.metodoPago)] ?? "Efectivo",
      metodoPago: (venta.metodoPago as VentaVendedor["metodoPago"]) ?? "efectivo",
      itemsDetalle: detalles?.map((detalle) => ({
        idProducto: String(detalle.producto.idProducto ?? ""),
        nombre: detalle.producto.nombre,
        cantidad: Number(detalle.cantidad),
        precioUnitario: Number(detalle.precioUnitario ?? 0),
      })),
    };
  });
}

export type VentaNueva = {
  idCliente: string;
  estado?: "pendiente" | "en_proceso" | "completada" | "cancelada" | "devuelta";
  metodoPago?: "efectivo" | "tarjeta" | "transferencia";
  items: { idProducto: string; cantidad: number; precioUnitario?: number }[];
};

async function crearVenta(venta: VentaNueva) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(`${BASE_URL}/ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(venta),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar la venta.");
  }

  return data;
}

async function actualizarEstadoVenta(
  idVenta: string,
  estado: NonNullable<VentaNueva["estado"]>,
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(`${BASE_URL}/ventas/${idVenta}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar el estado.");
  }

  return data;
}

const idVentaDe = (id: string) => id.replace("ORD-", "");

const vendedorService = {
  obtenerProductos,
  obtenerClientes,
  obtenerVentas,
  crearVenta,
  actualizarEstadoVenta,
  idVentaDe,
};

export default vendedorService;