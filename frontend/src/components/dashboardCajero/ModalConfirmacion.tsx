import type { ReactNode } from "react";

import "./ModalConfirmacion.css";

type ModalConfirmacionProps = {
  abierto: boolean;
  titulo: string;
  icono: ReactNode;
  tono?: "violeta" | "rojo";
  texto: ReactNode;
  detalle?: string;
  textoBoton: string;
  procesando?: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
};

const ModalConfirmacion = ({
  abierto,
  titulo,
  icono,
  tono = "violeta",
  texto,
  detalle,
  textoBoton,
  procesando = false,
  onCancelar,
  onConfirmar,
}: ModalConfirmacionProps) => {
  if (!abierto) return null;

  const rojo = tono === "rojo";

  return (
    <div className="mconf-overlay" onClick={onCancelar}>
      <div
        className="mconf-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <span className={`mconf-icono${rojo ? " rojo" : ""}`}>{icono}</span>
        <h3>{titulo}</h3>
        <p className="mconf-texto">{texto}</p>
        {detalle && <p className="mconf-detalle">{detalle}</p>}
        <div className="mconf-acciones">
          <button
            type="button"
            className="mconf-cancelar"
            onClick={onCancelar}
            disabled={procesando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`mconf-aceptar${rojo ? " rojo" : ""}`}
            onClick={onConfirmar}
            disabled={procesando}
          >
            {procesando ? "Procesando..." : textoBoton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;