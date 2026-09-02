import { useState } from "react";
import { Search } from "lucide-react";
import VendedorLayout from "../../components/dashboardCajero/VendedorLayout";
import { productosVendedor } from "../../data/mockDataVendedor";

import "./VendedorProductos.css";

const CATEGORIAS = ["Todas", "Electrónica", "Ropa y calzado", "Alimentos", "Hogar"];

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const VendedorProductos = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const filtrados = productosVendedor.filter((producto) => {
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoria === "Todas" || producto.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  const disponibles = productosVendedor.filter((p) => p.stock > 0).length;

  return (
    <VendedorLayout vista="Productos">
      <div className="vproductos-flex">
        <div>
          <h1 className="vproductos-titulo">Catálogo de productos</h1>
          <p className="vproductos-sub">{disponibles} productos disponibles para vender</p>
        </div>

        {/* Filtros */}
        <div className="vproductos-filtros">
          <div className="vproductos-buscar">
            <Search size={15} />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="vproductos-categorias">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                className={categoria === c ? "activo" : ""}
                onClick={() => setCategoria(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Tarjetas */}
        <div className="vproductos-grid">
          {filtrados.map((producto) => {
            const agotado = producto.stock === 0;
            const bajoStock = producto.stock > 0 && producto.stock <= producto.minStock;

            return (
              <div
                className={`vproducto-card${agotado ? " agotado" : ""}`}
                key={producto.id}
              >
                <div className="vproducto-top">
                  <span className="vproducto-categoria">{producto.categoria}</span>
                  <span className={`vproducto-stock ${agotado ? "sin-stock" : bajoStock ? "bajo" : ""}`}>
                    {agotado
                      ? "Sin stock"
                      : bajoStock
                        ? `Stock bajo · ${producto.stock}u`
                        : `${producto.stock} u.`}
                  </span>
                </div>

                <p className="vproducto-nombre">{producto.nombre}</p>
                <p className="vproducto-id">{producto.id}</p>

                <p className="vproducto-precio">{formatoCOP(producto.precio)}</p>

                <button className="vproducto-boton" disabled={agotado}>
                  {agotado ? "Sin disponibilidad" : "Agregar a venta"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </VendedorLayout>
  );
};

export default VendedorProductos;