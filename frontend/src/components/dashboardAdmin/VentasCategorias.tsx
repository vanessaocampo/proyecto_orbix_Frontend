import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";

import { useEffect, useState } from "react";

import ventasService from "../../services/ventas.services";
import productosService from "../../services/productos.services";

import "./ventasCategorias.css";

type DatoCategoria = {
  nombre: string;
  valor: number;
  fill: string;
};

const COLORES = [
  "#087c9c",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#94a3b8",
  "#ef4444",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#84cc16",
  "#a855f7",
  "#06b6d4",
  "#e11d48",
  "#64748b",
  "#22c55e",
];

const VentasCategoria = () => {
  const [datos, setDatos] = useState<DatoCategoria[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarVentasPorCategoria = async () => {
      try {
        setCargando(true);

        const [ventas, productos] = await Promise.all([
          ventasService.obtenerVentas(),
          productosService.obtenerProductos(),
        ]);

        // Solo ventas completadas
        const ventasCompletadas = ventas.filter(
          (venta) => venta.estado.toLowerCase() === "completada",
        );

        // Guardamos cuánto dinero corresponde a cada categoría
        const ventasPorCategoria: Record<string, number> = {};

        ventasCompletadas.forEach((venta) => {
          venta.detalles.forEach((detalle) => {
            const producto = productos.find(
              (p) => p.idProducto === detalle.producto.idProducto,
            );

            const categoria = producto?.categoria || "Otros";

            const subtotal = Number(detalle.subtotal);

            ventasPorCategoria[categoria] =
              (ventasPorCategoria[categoria] || 0) + subtotal;
          });
        });

        // Total vendido
        const totalVentas = Object.values(ventasPorCategoria).reduce(
          (total, valor) => total + valor,
          0,
        );

        // Convertimos los valores en porcentajes
        const datosCategoria: DatoCategoria[] = Object.entries(
          ventasPorCategoria,
        )
          .map(([nombre, valor], index) => ({
            nombre,
            valor:
              totalVentas > 0 ? Math.round((valor / totalVentas) * 100) : 0,
            fill: COLORES[index % COLORES.length],
          }))
          .filter((dato) => dato.valor > 0)
          .sort((a, b) => b.valor - a.valor);

        setDatos(datosCategoria);
      } catch (error) {
        console.error("Error al cargar las ventas por categoría:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarVentasPorCategoria();
  }, []);

  if (cargando) {
    return (
      <section className="ventas-categoria">
        <div className="categoria-header">
          <h3>Por categoría</h3>
          <p>Distribución de ventas</p>
        </div>

        <div className="grafica-donut">
          <p>Cargando datos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ventas-categoria">
      <div className="categoria-header">
        <h3>Por categoría</h3>
        <p>Distribución de ventas</p>
      </div>

      <div className="grafica-donut">
        {datos.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={datos}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="42%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
              >
                {datos.map((dato) => (
                  <Cell key={dato.nombre} fill={dato.fill} />
                ))}
              </Pie>

              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No hay ventas completadas.</p>
        )}
      </div>

      <div className="categorias-lista">
        {datos.map((dato) => (
          <div className="categoria-item" key={dato.nombre}>
            <div className="categoria-nombre">
              <span
                className="categoria-punto"
                style={{
                  backgroundColor: dato.fill,
                }}
              ></span>

              <span>{dato.nombre}</span>
            </div>

            <span>{dato.valor}%</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VentasCategoria;
