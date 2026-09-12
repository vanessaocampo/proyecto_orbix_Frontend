const BASE_URL = "http://localhost:3000/api/v1";

export type Categoria = {
  idCategoria: string;
  nombre: string;
  descripcion?: string | null;
};

type RespuestaApi = {
  success: boolean;
  data: Categoria[];
};

async function obtenerCategorias(): Promise<Categoria[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(`${BASE_URL}/categorias?limit=500`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Error al obtener las categorías.",
    );
  }

  return data.data;
}

async function crearCategoria(
  nombre: string,
  descripcion?: string,
): Promise<Categoria> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay sesión activa.");
  }

  const response = await fetch(`${BASE_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombre,
      descripcion: descripcion || null,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Error al crear la categoría.",
    );
  }

  return data.data;
}

const categoriasService = {
  obtenerCategorias,
  crearCategoria,
};

export default categoriasService;