import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ventasMensualesVendedor } from "../../data/mockDataVendedor";
import "./ChartsRow.css";

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const VentasChart = () => {
  return (
    <div className="vchart-card vchart-card-ancho">
      <h3>Mis ventas 2026</h3>
      <p className="vchart-sub">Evolución mensual acumulada</p>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={ventasMensualesVendedor} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="vendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fontFamily: "DM Mono, monospace", fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${v / 1000}k`}
            tick={{ fontSize: 10, fontFamily: "DM Mono, monospace", fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "DM Mono, monospace",
            }}
            formatter={(v) => [formatoCOP(Number(v)), "Mis ventas"]}
          />
          <Area
            type="monotone"
            dataKey="ventas"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#vendGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#8b5cf6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VentasChart;