import { BASE_URL } from "../config";

const authService = {
  async login(
    correo: string,
    password: string,
    captcha: string
  ) {
    const response = await fetch(
      `${BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          correo,
          password,
          captcha,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Error al iniciar sesión"
      );
    }

    return data;
  },

  async refresh() {
    const response = await fetch(
      `${BASE_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Sesión expirada"
      );
    }

    return data;
  },

  async me() {
    const response = await fetch(
      `${BASE_URL}/auth/me`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Sesión no válida"
      );
    }

    return data;
  },

  async logout() {
    const response = await fetch(
      `${BASE_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Error al cerrar sesión"
      );
    }

    return data;
  },

  async forgotPassword(correo: string) {
    const response = await fetch(
      `${BASE_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          correo,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Error al solicitar recuperación de contraseña"
      );
    }

    return data;
  },

  async resetPassword(
    token: string,
    passwordNueva: string
  ) {
    const response = await fetch(
      `${BASE_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token,
          passwordNueva,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Error al restablecer la contraseña"
      );
    }

    return data;
  },
};

export default authService;