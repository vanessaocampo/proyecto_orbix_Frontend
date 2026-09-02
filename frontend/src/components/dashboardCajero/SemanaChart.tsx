import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { metaSemanaVendedor } from "../../data/mockDataVendedor";
import "./ChartsRow.css";

const META_DIARIA = 4000;

const formatoCOP = (valor: number) =>
  valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const SemanaChart = () => {
  return (
    <div className="vchart-card vchart-card-estrecho">
      <h3>Esta semana vs meta</h3>
      <p className="vchart-sub">Meta diaria: {formatoCOP(META_DIARIA)}</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={metaSemanaVendedor} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="dia"
            tick={{ fontSize: 10, fontFamily: "DM Mono, monospace", fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${v / 1000}k`}
            tick={{ fontSize: 9, fontFamily: "DM Mono, monospace", fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "11px",
              fontFamily: "DM Mono, monospace",
            }}
            formatter={(v) => [formatoCOP(Number(v)), ""]}
          />
          <Bar dataKey="real" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Mis ventas" />
          <Bar dataKey="meta" fill="#ede9fe" radius={[4, 4, 0, 0]} name="Meta" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SemanaChart;