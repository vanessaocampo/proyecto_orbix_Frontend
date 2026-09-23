import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import authService from "../../services/auth.services";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const passwordValida =
    passwordNueva.length >= 12 &&
    /[A-Z]/.test(passwordNueva) &&
    /[a-z]/.test(passwordNueva) &&
    /[0-9]/.test(passwordNueva) &&
    /[^A-Za-z0-9]/.test(passwordNueva);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (!passwordValida) {
      setError(
        "La contraseña debe tener al menos 12 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
      return;
    }

    if (passwordNueva !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      await authService.resetPassword(
        token,
        passwordNueva
      );

      setMensaje(
        "Contraseña restablecida correctamente."
      );

      setTimeout(() => {
        navigate("/login/opera");
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo restablecer la contraseña."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="reset-password-page">
      <div className="reset-password-container">

        <h1>Nueva contraseña</h1>

        <p>
          Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="passwordNueva">
            Nueva contraseña
          </label>

          <input
            type="password"
            id="passwordNueva"
            placeholder="Ingresa la nueva contraseña"
            value={passwordNueva}
            onChange={(e) =>
              setPasswordNueva(e.target.value)
            }
            required
          />

          <div className="password-requisitos">
            <p>La contraseña debe tener:</p>

            <span className={passwordNueva.length >= 12 ? "valido" : ""}>
              {passwordNueva.length >= 12 ? "✓" : "•"} Mínimo 12 caracteres
            </span>

            <span className={/[A-Z]/.test(passwordNueva) ? "valido" : ""}>
              {/[A-Z]/.test(passwordNueva) ? "✓" : "•"} Una letra mayúscula
            </span>

            <span className={/[a-z]/.test(passwordNueva) ? "valido" : ""}>
              {/[a-z]/.test(passwordNueva) ? "✓" : "•"} Una letra minúscula
            </span>

            <span className={/[0-9]/.test(passwordNueva) ? "valido" : ""}>
              {/[0-9]/.test(passwordNueva) ? "✓" : "•"} Un número
            </span>

            <span
              className={
                /[^A-Za-z0-9]/.test(passwordNueva)
                  ? "valido"
                  : ""
              }
            >
              {/[^A-Za-z0-9]/.test(passwordNueva) ? "✓" : "•"} Un carácter especial
            </span>
          </div>

          <label htmlFor="confirmarPassword">
            Confirmar contraseña
          </label>

          <input
            type="password"
            id="confirmarPassword"
            placeholder="Confirma la nueva contraseña"
            value={confirmarPassword}
            onChange={(e) =>
              setConfirmarPassword(e.target.value)
            }
            required
          />

          {error && (
            <p className="reset-error">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="reset-success">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "Guardando..."
              : "Cambiar contraseña"}
          </button>

        </form>

      </div>
    </main>
  );
};

export default ResetPassword;