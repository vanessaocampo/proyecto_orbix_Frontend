import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./VentasMensuales.css";

const datosVentas = [
  { mes: "Ene", ventas: 48000 },
  { mes: "Feb", ventas: 52000 },
  { mes: "Mar", ventas: 47000 },
  { mes: "Abr", ventas: 61000 },
  { mes: "May", ventas: 58000 },
  { mes: "Jun", ventas: 73000 },
  { mes: "Jul", ventas: 68000 },
  { mes: "Ago", ventas: 82000 },
  { mes: "Sep", ventas: 77000 },
  { mes: "Oct", ventas: 92000 },
  { mes: "Nov", ventas: 88000 },
  { mes: "Dic", ventas: 105000 },
];

const VentasMensuales = () => {
  return (
    <section className="ventas-mensuales">
      <div className="ventas-mensuales-titulo">
        <h3>Ventas mensuales 2026</h3>

        <p>Acumulado anual: $ 858.000</p>
      </div>

      <div className="ventas-mensuales-grafica">
        <ResponsiveContainer width="100%" height={270}>
          <BarChart
            data={datosVentas}
            margin={{
              top: 10,
              right: 5,
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
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#58708c",
                fontSize: 13,
              }}
            />

            <YAxis
              domain={[0, 120000]}
              ticks={[0, 30000, 60000, 90000, 120000]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(valor) =>
                `$${valor / 1000}k`
              }
              tick={{
                fill: "#58708c",
                fontSize: 13,
              }}
            />

            <Tooltip
              formatter={(valor) =>
                `$ ${Number(valor).toLocaleString("es-CO")}`
              }
              labelFormatter={(mes) => mes}
              contentStyle={{
                border: "1px solid #d9e0e8",
                borderRadius: "12px",
                fontSize: "14px",
              }}
            />

            <Bar
              dataKey="ventas"
              fill="#087c9c"
              radius={[6, 6, 0, 0]}
              barSize={23}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default VentasMensuales;