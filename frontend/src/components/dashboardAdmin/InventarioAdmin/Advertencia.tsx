import "./Advertencia.css";

import { TriangleAlert } from "lucide-react";

interface AdvertenciaProps {
  cantidad: number;
}

const Advertencia = ({
  cantidad,
}: AdvertenciaProps) => {
  return (
    <div className="advertencia">

      <div className="advertencia-logo">
        <TriangleAlert size={22} />
      </div>

      <p className="advertencia-parrafo">
        <span>{cantidad} productos</span>{" "}
        están por debajo de stock mínimo recomendado.
      </p>

    </div>
  );
};

export default Advertencia;