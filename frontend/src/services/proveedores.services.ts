const BASE_URL = "http://localhost:3000/api/v1";

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

type RespuestaApi = {
  success: boolean;
  data: Proveedor[];
};

async function obtenerProveedores(): Promise<Proveedor[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(`${BASE_URL}/proveedores?limit=500`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Error al obtener los proveedores.",
    );
  }

  return data.data;
}

async function crearProveedor(
  nombre: string,
  nit: string,
): Promise<Proveedor> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(`${BASE_URL}/proveedores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombre,
      nit,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Error al crear el proveedor.",
    );
  }

  return data.data;
}

const proveedoresService = {
  obtenerProveedores,
  crearProveedor,
};

export default proveedoresService;