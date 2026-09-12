import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import "./Aviso.css";

type AvisoProps = {
  children: ReactNode;
};

const Aviso = ({ children }: AvisoProps) => {
  return (
    <div className="aviso" role="alert">
      <AlertTriangle size={16} />
      <span>{children}</span>
    </div>
  );
};

export default Aviso;