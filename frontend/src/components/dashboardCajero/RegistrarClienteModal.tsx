import { useState } from "react";
import { X, Check } from "lucide-react";

import "./RegistrarClienteModal.css";

type ClienteNuevo = {
  nombre: string;
  documento: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  ciudad?: string;
  segmento?: "minorista" | "mayorista" | "frecuente" | "nuevo";
};

type RegistrarClienteModalProps = {
  abierto: boolean;
  onCerrar: () => void;
  onRegistrar: (cliente: ClienteNuevo) => Promise<void> | void;
  enviando?: boolean;
  error?: string;
};

const SEGMENTOS = [
  { valor: "nuevo", etiqueta: "Nuevo" },
  { valor: "minorista", etiqueta: "Minorista" },
  { valor: "mayorista", etiqueta: "Mayorista" },
  { valor: "frecuente", etiqueta: "Frecuente" },
] as const;

const RegistrarClienteModal = ({
  abierto,
  onCerrar,
  onRegistrar,
  enviando = false,
  error = "",
}: RegistrarClienteModalProps) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      // El error se muestra vía la prop `error` del padre
    }
  };

  const cerrarYReiniciar = () => {
    onCerrar();
    setNombre("");
    setDocumento("");
    setTelefono("");
    setCorreo("");
    setDireccion("");
    setCiudad("");
    setSegmento("nuevo");
    setRegistrado(false);
  };

  if (!abierto) return null;

  return (
    <div className="clic-modal-overlay" onClick={onCerrar}>
      <div
        className="clic-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Registrar cliente"
      >
        <div className="clic-modal-header">
          <div className="clic-modal-titulo-wrap">
            <h3>👤 Nuevo cliente</h3>
            <span className="clic-modal-badge">Orbix</span>
          </div>
          <p className="clic-modal-subtitulo">
            Completa los datos del cliente para asignarlo.
          </p>
          <button
            type="button"
            className="clic-modal-cerrar"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {registrado ? (
          <div className="clic-modal-exito">
            <span className="clic-modal-exito-icono">✅</span>
            <h3>Cliente registrado</h3>
            <p>
              <strong>{nombre}</strong> {ciudad && `de ${ciudad}`} se agregó a
              tus clientes.
            </p>
            <button
              type="button"
              className="clic-modal-exito-btn"
              onClick={cerrarYReiniciar}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="clic-modal-cuerpo">
              <div className="clic-fila">
                <div className="clic-campo">
                  <label htmlFor="clic-nombre">Nombre *</label>
                  <input
                    id="clic-nombre"
                    type="text"
                    className="clic-input"
                    placeholder="Ej. María García"
                    required
                    maxLength={150}
                    autoFocus
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="clic-campo">
                  <label htmlFor="clic-documento">Documento *</label>
                  <input
                    id="clic-documento"
                    type="text"
                    className="clic-input"
                    placeholder="Ej. 1123456789"
                    required
                    maxLength={20}
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                  />
                </div>
              </div>

              <div className="clic-fila">
                <div className="clic-campo">
                  <label htmlFor="clic-telefono">Teléfono</label>
                  <input
                    id="clic-telefono"
                    type="tel"
                    className="clic-input"
                    placeholder="Ej. +54 11 2345 6789"
                    maxLength={20}
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <div className="clic-campo">
                  <label htmlFor="clic-correo">Correo</label>
                  <input
                    id="clic-correo"
                    type="email"
                    className="clic-input"
                    placeholder="cliente@empresa.com"
                    maxLength={120}
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
              </div>

              <div className="clic-fila">
                <div className="clic-campo">
                  <label htmlFor="clic-direccion">Dirección</label>
                  <input
                    id="clic-direccion"
                    type="text"
                    className="clic-input"
                    placeholder="Ej. Av. Siempre Viva 742"
                    maxLength={200}
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>

                <div className="clic-campo">
                  <label htmlFor="clic-ciudad">Ciudad</label>
                  <input
                    id="clic-ciudad"
                    type="text"
                    className="clic-input"
                    placeholder="Ej. Buenos Aires"
                    maxLength={100}
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                  />
                </div>
              </div>

              <div className="clic-campo">
                <label htmlFor="clic-segmento">Segmento</label>
                <select
                  id="clic-segmento"
                  className="clic-input"
                  value={segmento}
                  onChange={(e) =>
                    setSegmento(e.target.value as typeof segmento)
                  }
                >
                  {SEGMENTOS.map((item) => (
                    <option key={item.valor} value={item.valor}>
                      {item.etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="clic-error">{error}</p>}
            </div>

            <div className="clic-modal-footer">
              <button
                type="button"
                className="clic-cancelar"
                onClick={onCerrar}
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="clic-registrar"
                disabled={enviando}
              >
                <Check size={16} />
                {enviando ? "Registrando..." : "Registrar cliente"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrarClienteModal;