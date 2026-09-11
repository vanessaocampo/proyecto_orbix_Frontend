const BASE_URL = "http://localhost:3000/api/v1";

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

async function obtenerVentas(): Promise<Venta[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(
    `${BASE_URL}/ventas?limit=500`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: RespuestaVentas = await response.json();

  if (!response.ok || !data.success) {
    throw new Error("Error al obtener las ventas.");
  }

  return data.data;
}

async function obtenerVentaPorId(
  idVenta: string
): Promise<Venta> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(
    `${BASE_URL}/ventas/${idVenta}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: RespuestaVenta = await response.json();

  if (!response.ok || !data.success) {
    throw new Error("Error al obtener la venta.");
  }

  return data.data;
}

async function crearVenta(
  venta: CrearVentaData
): Promise<Venta> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(
    `${BASE_URL}/ventas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(venta),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Error al crear la venta."
    );
  }

  return data.data;
}

const ventasService = {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
};

export default ventasService;