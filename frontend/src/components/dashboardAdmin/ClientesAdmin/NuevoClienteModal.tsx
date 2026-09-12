import { useState } from "react";
import { X, Check, CheckCircle2 } from "lucide-react";

import "./NuevoClienteModal.css";

type ClienteNuevo = {
  nombre: string;
  documento: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  ciudad?: string;
  segmento?: "minorista" | "mayorista" | "frecuente" | "nuevo";
};

interface NuevoClienteModalProps {
  abierto: boolean;
  cerrar: () => void;
  onRegistrar: (cliente: ClienteNuevo) => Promise<void> | void;
  cargando?: boolean;
  error?: string;
}

const SEGMENTOS = [
  { valor: "nuevo", etiqueta: "Nuevo" },
  { valor: "minorista", etiqueta: "Minorista" },
  { valor: "mayorista", etiqueta: "Mayorista" },
  { valor: "frecuente", etiqueta: "Frecuente" },
] as const;

const NuevoClienteModal = ({
  abierto,
  cerrar,
  onRegistrar,
  cargando = false,
  error = "",
}: NuevoClienteModalProps) => {
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [segmento, setSegmento] = useState<
    "minorista" | "mayorista" | "frecuente" | "nuevo"
  >("nuevo");

  const [registrado, setRegistrado] = useState(false);

  const manejarSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await onRegistrar({
        nombre: nombre.trim(),
        documento: documento.trim(),
        telefono: telefono.trim() || undefined,
        correo: correo.trim() || undefined,
        direccion: direccion.trim() || undefined,
        ciudad: ciudad.trim() || undefined,
        segmento,
      });

      setRegistrado(true);
    } catch {
      // El error lo controla el componente padre
    }
  };

  const cerrarYLimpiar = () => {
    cerrar();

    setNombre("");
    setDocumento("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
    setCiudad("");
    setSegmento("nuevo");
    setRegistrado(false);
  };

  if (!abierto) {
    return null;
  }

  return (
    <div
      className="nuevo-cliente-overlay"
      onClick={cerrar}
    >
      <div
        className="nuevo-cliente-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ENCABEZADO */}
        <div className="nuevo-cliente-header">
          <div>
            <div className="nuevo-cliente-titulo">
              <h2>Nuevo cliente</h2>

              <span className="nuevo-cliente-orbix">
                Orbix
              </span>
            </div>

            <p>
              Completa los datos del cliente para asignarlo.
            </p>
          </div>

          <button
            type="button"
            className="nuevo-cliente-cerrar"
            onClick={cerrar}
            disabled={cargando}
          >
            <X size={24} />
          </button>
        </div>

        {/* CLIENTE REGISTRADO */}
        {registrado ? (
          <div className="cliente-registrado">
            <CheckCircle2 size={45} />

            <h3>Cliente registrado</h3>

            <p>
              <strong>{nombre}</strong>
              {ciudad && ` de ${ciudad}`} se agregó
              correctamente a tus clientes.
            </p>

            <button
              type="button"
              className="boton-registrar-cliente"
              onClick={cerrarYLimpiar}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={manejarSubmit}>

            {/* FORMULARIO */}
            <div className="nuevo-cliente-formulario">

              <div className="nuevo-cliente-grid">

                <div className="campo-cliente">
                  <label>Nombre *</label>

                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                    placeholder="Ej. María García"
                    required
                    maxLength={150}
                  />
                </div>

                <div className="campo-cliente">
                  <label>Documento *</label>

                  <input
                    type="text"
                    value={documento}
                    onChange={(e) =>
                      setDocumento(e.target.value)
                    }
                    placeholder="Ej. 1123456789"
                    required
                    maxLength={20}
                  />
                </div>

                <div className="campo-cliente">
                  <label>Teléfono</label>

                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) =>
                      setTelefono(e.target.value)
                    }
                    placeholder="Ej. +57 3001234567"
                    maxLength={20}
                  />
                </div>

                <div className="campo-cliente">
                  <label>Correo</label>

                  <input
                    type="email"
                    value={correo}
                    onChange={(e) =>
                      setCorreo(e.target.value)
                    }
                    placeholder="cliente@empresa.com"
                    maxLength={120}
                  />
                </div>

                <div className="campo-cliente">
                  <label>Dirección</label>

                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) =>
                      setDireccion(e.target.value)
                    }
                    placeholder="Ej. Calle 10 # 20-30"
                    maxLength={200}
                  />
                </div>

                <div className="campo-cliente">
                  <label>Ciudad</label>

                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) =>
                      setCiudad(e.target.value)
                    }
                    placeholder="Ej. Medellín"
                    maxLength={100}
                  />
                </div>

              </div>

              {/* SEGMENTO */}
              <div className="campo-cliente campo-segmento">
                <label>Segmento</label>

                <select
                  value={segmento}
                  onChange={(e) =>
                    setSegmento(
                      e.target.value as typeof segmento
                    )
                  }
                >
                  {SEGMENTOS.map((item) => (
                    <option
                      key={item.valor}
                      value={item.valor}
                    >
                      {item.etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              {/* ERROR */}
              {error && (
                <p className="nuevo-cliente-error">
                  {error}
                </p>
              )}

            </div>

            {/* BOTONES */}
            <div className="nuevo-cliente-footer">

              <button
                type="button"
                className="boton-cancelar-cliente"
                onClick={cerrar}
                disabled={cargando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="boton-registrar-cliente"
                disabled={cargando}
              >
                <Check size={19} />

                {cargando
                  ? "Registrando..."
                  : "Registrar cliente"}
              </button>

            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default NuevoClienteModal;