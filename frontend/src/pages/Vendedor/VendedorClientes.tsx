import { useState } from "react";
import { Search, Plus, MapPin } from "lucide-react";
import VendedorLayout from "../../components/dashboardCajero/VendedorLayout";
import { clientesVendedor } from "../../data/mockDataVendedor";

import "./VendedorClientes.css";

const COLORES_AVATAR = ["#8b5cf6", "#0e7490", "#10b981", "#f59e0b", "#3b82f6"];

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const VendedorClientes = () => {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = clientesVendedor.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.ciudad.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const totalCompras = clientesVendedor.reduce(
    (acumulado, cliente) => acumulado + cliente.totalCompras,
    0,
  );

  return (
    <VendedorLayout vista="Mis Clientes">
      <div className="vclientes-flex">
        <div className="vclientes-header">
          <div>
            <h1 className="vclientes-titulo">Mis Clientes</h1>
            <p className="vclientes-sub">
              {clientesVendedor.length} clientes asignados · {formatoCOP(totalCompras)} en compras
            </p>
          </div>

          <button className="vclientes-nuevo">
            <Plus size={16} />
            Nuevo cliente
          </button>
        </div>

        {/* Búsqueda */}
        <div className="vclientes-buscar">
          <Search size={15} />
          <input
            type="text"
            placeholder="Buscar cliente o ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tarjetas */}
        <div className="vclientes-grid">
          {filtrados.map((cliente) => {
            const color = COLORES_AVATAR[cliente.nombre.charCodeAt(0) % COLORES_AVATAR.length];
            const iniciales = cliente.nombre
              .split(" ")
              .slice(0, 2)
              .map((palabra) => palabra[0])
              .join("")
              .toUpperCase();

            return (
              <div className="vcliente-card" key={cliente.id}>
                <div className="vcliente-top">
                  <div
                    className="vcliente-avatar"
                    style={{ backgroundColor: `${color}22`, color }}
                  >
                    {iniciales}
                  </div>
                  <div className="vcliente-nombre-box">
                    <p className="vcliente-nombre">{cliente.nombre}</p>
                    <p className="vcliente-id">{cliente.id}</p>
                  </div>
                </div>

                <div className="vcliente-divisor" />

                <div className="vcliente-datos-grid">
                  <div>
                    <p className="vcliente-dato-label">Total compras</p>
                    <p className="vcliente-dato-valor">{formatoCOP(cliente.totalCompras)}</p>
                  </div>
                  <div>
                    <p className="vcliente-dato-label">Pedidos</p>
                    <p className="vcliente-dato-valor">{cliente.pedidos}</p>
                  </div>
                </div>

                <div className="vcliente-ubicacion">
                  <MapPin size={13} />
                  <span>{cliente.ciudad}</span>
                  <span className="vcliente-ultimo">{cliente.ultimo}</span>
                </div>

                <button className="vcliente-boton">Nueva venta para este cliente</button>
              </div>
            );
          })}
        </div>
      </div>
    </VendedorLayout>
  );
};

export default VendedorClientes;