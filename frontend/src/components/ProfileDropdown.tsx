import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ProfileDropdown.css";
import authService from "../services/auth.services";
import { BASE_URL } from "../config";

interface ProfileData {
  idUsuario: string;
  nombre: string;
  correo: string;
  rol: string;
  identificacion?: string;
  correoPersonal?: string;
  direccion?: string;
  celular?: string;
  fechaNacimiento?: string;
  fechaIngreso?: string;
}

let refreshPromise: Promise<void> | null = null;

/*
 * RENOVAR SESIÓN
 *
 * Evita varios refresh simultáneos cuando
 * varias peticiones reciben 401 al mismo tiempo.
 */

async function renovarSesion(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        await authService.refresh();
      } catch {
        window.location.href = "/login/opera";
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
 * Si la petición recibe 401, renueva la sesión
 * y vuelve a intentar la petición una sola vez.
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

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] =
    useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    celular: "",
    direccion: "",
  });

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetchConRefresh(
        `${BASE_URL}/auth/me`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error(
          "No se pudo obtener el perfil."
        );
      }

      const data = await res.json();

      setProfileData(data.data);

      setEditForm({
        nombre: data.data.nombre || "",
        celular: data.data.celular || "",
        direccion: data.data.direccion || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Cargar el perfil real al entrar al dashboard
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleToggle = () => {
    if (!isOpen && !profileData) {
      fetchProfile();
    }

    setIsOpen(!isOpen);
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetchConRefresh(
        `${BASE_URL}/auth/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) {
        throw new Error(
          "No se pudo actualizar el perfil."
        );
      }

      const data = await res.json();

      setProfileData(data.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAccount = () => {
    setIsEditing(false);
    setIsModalOpen(true);
    setIsOpen(false);

    if (!profileData) {
      fetchProfile();
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error
      );
    } finally {
      navigate("/login/opera");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";

    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return (
        parts[0][0] +
        parts[1][0]
      ).toUpperCase();
    }

    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  };

  const displayData = profileData || {
    nombre: "Usuario",
    correo: "",
    rol: "admin",
  };

  const initials = getInitials(
    displayData.nombre
  );

  const getRoleColor = (rol: string) => {
    switch (rol?.toLowerCase()) {
      case "admin":
        return "#087c9c";

      case "vendedor":
      case "cajero":
        return "#8b5cf6";

      case "inventario":
        return "#10b981";

      default:
        return "#10b981";
    }
  };

  const roleColor = getRoleColor(
    displayData.rol
  );

  return (
    <div
      className="profile-dropdown-container"
      ref={dropdownRef}
    >
      <div
        className={`avatar-trigger ${
          isOpen ? "open" : ""
        }`}
        onClick={handleToggle}
        style={{
          backgroundColor: roleColor,
        }}
      >
        {initials}
      </div>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <div
              className="profile-dropdown-avatar"
              style={{
                borderColor: roleColor,
                color: roleColor,
              }}
            >
              {initials}
            </div>

            <div className="profile-dropdown-info">
              <h4 className="profile-dropdown-name">
                {displayData.nombre}
              </h4>

              <p
                className="profile-dropdown-role"
                style={{
                  color: roleColor,
                  fontWeight: "bold",
                }}
              >
                {displayData.rol
                  ? displayData.rol
                      .charAt(0)
                      .toUpperCase() +
                    displayData.rol.slice(1)
                  : "Rol no definido"}
              </p>

              <p className="profile-dropdown-email">
                {displayData.correo}
              </p>

              <button
                className="profile-dropdown-link"
                onClick={
                  handleOpenAccount
                }
              >
                Ver cuenta
              </button>
            </div>
          </div>

          <div className="profile-dropdown-footer">
            <button
              className="profile-dropdown-logout"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {isModalOpen &&
        createPortal(
          <div className="cuenta-modal-overlay">
            <div className="cuenta-modal-content">
              <div className="cuenta-modal-header">
                <h3>
                  Información del Empleado
                </h3>

                {isEditing ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="profile-btn-save"
                      onClick={
                        handleSaveProfile
                      }
                      style={{
                        backgroundColor:
                          roleColor,
                      }}
                    >
                      Guardar
                    </button>

                    <button
                      className="profile-btn-cancel"
                      onClick={() =>
                        setIsEditing(false)
                      }
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    className="profile-btn-edit"
                    onClick={() =>
                      setIsEditing(true)
                    }
                  >
                    Editar
                  </button>
                )}

                <button
                  className="cuenta-close-btn"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                >
                  <X size={24} />
                </button>
              </div>

              <div className="cuenta-grid">
                <div className="cuenta-field">
                  <label>
                    Nombre completo
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.nombre}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          nombre:
                            e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>
                      {displayData.nombre ||
                        "N/A"}
                    </span>
                  )}
                </div>

                <div className="cuenta-field">
                  <label>
                    Identificacin
                  </label>

                  <span>
                    {profileData?.identificacion ||
                      "N/A"}
                  </span>
                </div>

                <div className="cuenta-field">
                  <label>
                    Correo corporativo
                  </label>

                  <span>
                    {displayData.correo ||
                      "N/A"}
                  </span>
                </div>

                <div className="cuenta-field">
                  <label>
                    Correo personal
                  </label>

                  <span>
                    {profileData?.correoPersonal ||
                      "N/A"}
                  </span>
                </div>

                <div className="cuenta-field">
                  <label>Celular</label>

                  {isEditing ? (
                    <input
                      type="text"
                      value={
                        editForm.celular
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          celular:
                            e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>
                      {profileData?.celular ||
                        "N/A"}
                    </span>
                  )}
                </div>

                <div className="cuenta-field">
                  <label>
                    Direccin
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      value={
                        editForm.direccion
                      }
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          direccion:
                            e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>
                      {profileData?.direccion ||
                        "N/A"}
                    </span>
                  )}
                </div>

                <div className="cuenta-field">
                  <label>
                    Fecha de nacimiento
                  </label>

                  <span>
                    {profileData?.fechaNacimiento
                      ? new Date(
                          profileData.fechaNacimiento
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="cuenta-field">
                  <label>
                    Fecha de ingreso a la empresa
                  </label>

                  <span>
                    {profileData?.fechaIngreso
                      ? new Date(
                          profileData.fechaIngreso
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ProfileDropdown;