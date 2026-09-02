import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./VentasPorPeriodo.css";

const datosVentas = [
  {
    dia: "Lun",
    ingresos: 14500,
    gastos: 8500,
  },
  {
    dia: "Mar",
    ingresos: 18000,
    gastos: 9000,
  },
  {
    dia: "Mié",
    ingresos: 13000,
    gastos: 8000,
  },
  {
    dia: "Jue",
    ingresos: 22500,
    gastos: 11500,
  },
  {
    dia: "Vie",
    ingresos: 32000,
    gastos: 15000,
  },
  {
    dia: "Sáb",
    ingresos: 28500,
    gastos: 12500,
  },
  {
    dia: "Dom",
    ingresos: 10000,
    gastos: 6000,
  },
];

const VentasPorPeriodo = () => {
  return (
    <section className="ventas-por-periodo">
      <div className="ventas-por-periodo-titulo">
        <div>
          <h3>Ingresos vs gastos — esta semana</h3>

          <p>Comparativo diario de ingresos y egresos</p>
        </div>
      </div>

      <div className="ventas-por-periodo-grafica">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={datosVentas}
            margin={{
              top: 10,
              right: 15,
              left: 5,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#d9e0e8"
            />

            <XAxis
              dataKey="dia"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#58708c",
                fontSize: 14,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 32000]}
              ticks={[0, 8000, 16000, 24000, 32000]}
              tickFormatter={(valor) => `$${valor / 1000}k`}
              tick={{
                fill: "#58708c",
                fontSize: 13,
              }}
            />

            <Tooltip
              formatter={(valor, nombre) => [
                `$ ${Number(valor).toLocaleString("es-CO")}`,
                nombre === "ingresos" ? "Ingresos" : "Gastos",
              ]}
              contentStyle={{
                border: "1px solid #d9e0e8",
                borderRadius: "10px",
                fontSize: "13px",
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={30}
              iconType="line"
              wrapperStyle={{
                fontSize: "14px",
                color: "#58708c",
              }}
              formatter={(valor) =>
                valor === "gastos" ? "Gastos" : "Ingresos"
              }
            />

            <Line
              type="monotone"
              dataKey="gastos"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeDasharray="7 6"
              dot={{
                r: 5,
                fill: "#f59e0b",
                stroke: "#f59e0b",
              }}
              activeDot={{
                r: 6,
              }}
            />

            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#087c9c"
              strokeWidth={3}
              dot={{
                r: 6,
                fill: "#087c9c",
                stroke: "#087c9c",
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default VentasPorPeriodo;
