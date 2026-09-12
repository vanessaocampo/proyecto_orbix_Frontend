import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import ventasService from "../../services/ventas.services";

import "./VentasAnuales.css";

type DatoVenta = {
  mes: string;
  ventas: number;
};

const Ventasanuales = () => {
  const [datos, setDatos] = useState<DatoVenta[]>([
    { mes: "Ene", ventas: 0 },
    { mes: "Feb", ventas: 0 },
    { mes: "Mar", ventas: 0 },
    { mes: "Abr", ventas: 0 },
    { mes: "May", ventas: 0 },
    { mes: "Jun", ventas: 0 },
    { mes: "Jul", ventas: 0 },
    { mes: "Ago", ventas: 0 },
    { mes: "Sep", ventas: 0 },
    { mes: "Oct", ventas: 0 },
    { mes: "Nov", ventas: 0 },
    { mes: "Dic", ventas: 0 },
  ]);

  useEffect(() => {
    const cargarVentasAnuales = async () => {
      try {
        const ventas = await ventasService.obtenerVentas();

        const añoActual = new Date().getFullYear();

        const meses = [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ];

        // Inicializamos todos los meses en 0
        const ventasPorMes = meses.map((mes) => ({
          mes,
          ventas: 0,
        }));

        // Sumamos solamente las ventas completadas
        ventas.forEach((venta) => {
          const fechaVenta = new Date(venta.fecha);

          if (
            fechaVenta.getFullYear() === añoActual &&
            venta.estado.toLowerCase() === "completada"
          ) {
            const mes = fechaVenta.getMonth();

            ventasPorMes[mes].ventas += Number(venta.total);
          }
        });

        setDatos(ventasPorMes);
      } catch (error) {
        console.error(
          "Error al cargar las ventas anuales:",
          error
        );
      }
    };

    cargarVentasAnuales();
  }, []);

  return (
    <section className="ventas-anuales">
      <div className="ventas-header">
        <div>
          <h3>Ventas anuales</h3>
          <p>Ventas completadas por mes {new Date().getFullYear()}</p>
        </div>

        <div className="leyenda">
          <span>● Ventas</span>
        </div>
      </div>

      <div className="grafica">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="mes" />

            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(valor) =>
                `$${Number(valor).toLocaleString("es-CO")}`
              }
            />

            <Tooltip
              formatter={(valor) =>
                `$${Number(valor).toLocaleString("es-CO")}`
              }
            />

            <Line
              type="monotone"
              dataKey="ventas"
              stroke="#087c9c"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default Ventasanuales;