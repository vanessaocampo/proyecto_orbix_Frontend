import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useEffect, useState } from "react";
import ventasService from "../../services/ventas.services";

import "./EstaSemana.css";

type DatoDia = {
  dia: string;
  ingresos: number;
  gastos: number;
};

const EstaSemana = () => {
  const [datos, setDatos] = useState<DatoDia[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatosSemana = async () => {
      try {
        setCargando(true);

        const ventas = await ventasService.obtenerVentas();

        const hoy = new Date();

        // Día de la semana actual
        // Domingo = 0, Lunes = 1...
        const diaActual = hoy.getDay();

        // Calculamos el lunes de esta semana
        const diferenciaLunes = diaActual === 0 ? -6 : 1 - diaActual;

        const lunes = new Date(hoy);
        lunes.setDate(hoy.getDate() + diferenciaLunes);
        lunes.setHours(0, 0, 0, 0);

        const nombresDias = [
          "Lun",
          "Mar",
          "Mié",
          "Jue",
          "Vie",
          "Sáb",
          "Dom",
        ];

        const datosSemana: DatoDia[] = nombresDias.map((dia) => ({
          dia,
          ingresos: 0,
          gastos: 0,
        }));

        // Sumamos las ventas completadas de cada día
        ventas.forEach((venta) => {
          if (venta.estado.toLowerCase() !== "completada") {
            return;
          }

          const fechaVenta = new Date(venta.fecha);

          const fechaDia = new Date(fechaVenta);
          fechaDia.setHours(0, 0, 0, 0);

          const diferenciaDias = Math.floor(
            (fechaDia.getTime() - lunes.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (diferenciaDias >= 0 && diferenciaDias < 7) {
            datosSemana[diferenciaDias].ingresos += Number(
              venta.total
            );
          }
        });

        setDatos(datosSemana);
      } catch (error) {
        console.error(
          "Error al cargar los datos de esta semana:",
          error
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDatosSemana();
  }, []);

  const formatearDinero = (valor: number) => {
    return `$${Number(valor).toLocaleString("es-CO")}`;
  };

  return (
    <section className="esta-semana">
      <div className="esta-semana-header">
        <div>
          <h3>Esta semana</h3>
          <p>Ingresos vs gastos diarios</p>
        </div>
      </div>

      <div className="grafica-semana">
        {cargando ? (
          <p>Cargando datos...</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={datos}>
              <CartesianGrid strokeDasharray="4 4" />

              <XAxis dataKey="dia" />

              <YAxis
                tickFormatter={(valor) =>
                  `$${Number(valor) / 1000}k`
                }
              />

              <Tooltip
                formatter={(valor) =>
                  formatearDinero(Number(valor))
                }
              />

              <Legend />

              <Bar
                dataKey="ingresos"
                name="Ingresos"
                fill="#087c9c"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="gastos"
                name="Gastos"
                fill="#dceff4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default EstaSemana;