interface NotificacionProps {
  mensaje: string;
  onCerrar: () => void;
}

const Notificacion = ({
  mensaje,
  onCerrar,
}: NotificacionProps) => {
  return (
    <div className="notificacion-exito">
      <div className="notificacion-contenido">
        <div className="notificacion-icono">
          ✓
        </div>

        <span>{mensaje}</span>

        <button
          type="button"
          onClick={onCerrar}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notificacion;