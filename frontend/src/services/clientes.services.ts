const BASE_URL = "http://localhost:3000/api/v1";

export type ClienteNuevo = {
  nombre: string;
  documento: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  ciudad?: string;
  segmento?: "minorista" | "mayorista" | "frecuente" | "nuevo";
};

const clienteService = {
  async crear(cliente: ClienteNuevo) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay sesión activa.");
    }

    const response = await fetch(`${BASE_URL}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cliente),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al registrar el cliente.");
    }

    return data;
  },
};

export default clienteService;