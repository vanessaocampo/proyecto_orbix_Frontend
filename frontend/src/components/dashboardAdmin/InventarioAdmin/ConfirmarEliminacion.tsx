interface ConfirmarEliminacionProps {
  nombreProducto: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ConfirmarEliminacion = ({
  nombreProducto,
  onConfirmar,
  onCancelar,
}: ConfirmarEliminacionProps) => {
  return (
    <div className="confirmacion-overlay">
      <div className="confirmacion-modal">
        <div className="confirmacion-icono">
          !
        </div>

        <h3>Eliminar producto</h3>

        <p>
          ¿Estás seguro de que deseas eliminar
          <strong> {nombreProducto}</strong>?
        </p>

        <div className="confirmacion-acciones">
          <button
            type="button"
            className="confirmacion-cancelar"
            onClick={onCancelar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="confirmacion-eliminar"
            onClick={onConfirmar}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarEliminacion;