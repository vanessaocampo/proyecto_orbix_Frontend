import { useState, useEffect } from "react";
import CardsInventario, { type CardsInventarioProps } from "../../components/dashboardInventario/CardsInventario";
import StockBajoTable, { type ProductoStockBajo } from "../../components/dashboardInventario/StockBajoTable";
import StockChart, { type StockChartData } from "../../components/dashboardInventario/StockChart";
import UltimosMovimientos, { type Movimiento } from "../../components/dashboardInventario/UltimosMovimientos";
import { useInventory } from "../../context/InventoryContext";

const DashboardInventario = () => {
  const { productos, movimientos } = useInventory();
  const [isLoading, setIsLoading] = useState(true);

  // Métrica general
  const [dashboardMetrics, setDashboardMetrics] = useState<CardsInventarioProps['metrics']>({
    valorTotal: 0,
    totalProductos: 0,
    productosStockBajo: 0,
    sinStock: 0,
    movimientosHoy: { total: 0, entradas: 0, salidas: 0 }
  });

  const [stockBajo, setStockBajo] = useState<ProductoStockBajo[]>([]);
  const [chartData, setChartData] = useState<StockChartData[]>([]);
  const [movimientosRecientes, setMovimientosRecientes] = useState<Movimiento[]>([]);

  useEffect(() => {
    // Calculando métricas dinámicas
    const valorT = productos.reduce((acc, p) => acc + p.valor, 0);
    const prodBajo = productos.filter(p => p.stock <= p.stockMin && p.stock > 0).length;
    const sinStk = productos.filter(p => p.stock === 0).length;

    // Calcular las operaciones del dia (entradas y salidas) en base a todos los movs
    const totalEntradas = movimientos.filter(m => m.tipo === "Entrada").length;
    const totalSalidas = movimientos.filter(m => m.tipo === "Salida").length;

    setDashboardMetrics({
      valorTotal: valorT,
      totalProductos: productos.length,
      productosStockBajo: prodBajo,
      sinStock: sinStk,
      movimientosHoy: { total: movimientos.length, entradas: totalEntradas, salidas: totalSalidas }
    });

    // Productos con stock bajo
    const tableStockBajo = productos
      .filter(p => p.stock <= p.stockMin)
      .slice(0, 4) // max 4 for dashboard
      .map(p => ({
        producto: p.nombre,
        stockActual: p.stock,
        stockMin: p.stockMin,
        deficit: p.stock - p.stockMin,
        proveedor: p.proveedor
      }));
    setStockBajo(tableStockBajo);

    // Chart Data (Distribución de valor por categoría)
    const categoriasVal = productos.reduce((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + p.valor;
      return acc;
    }, {} as Record<string, number>);

    setChartData(Object.keys(categoriasVal).map(cat => ({
      name: cat,
      valor: categoriasVal[cat]
    })));

    // Movimientos recientes adaptados al formato del componente
    const movRecientes = movimientos.slice(0, 5).map(m => {
      let iconT: "in" | "out" | "adj" = "adj";
      if (m.tipo === "Entrada") iconT = "in";
      else if (m.tipo === "Salida") iconT = "out";

      return {
        tipo: m.tipo,
        producto: m.producto,
        detalle: `${m.cantidad} - ${m.responsable}`,
        fecha: m.fecha.substring(0, 6), // 30 Jul
        iconType: iconT
      };
    });
    setMovimientosRecientes(movRecientes);

    // Simulamos carga rápida la primera vez
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  }, [productos, movimientos, isLoading]);

  return (
    <>
      <div className="encabezado-dashboard-inv">
        <h2>Dashboard Principal</h2>
        <p className="fecha-mes-inv">Resumen general del inventario</p>
      </div>
      
      <div className="dashboard-content">
        <CardsInventario metrics={dashboardMetrics} isLoading={isLoading} />
        <StockBajoTable data={stockBajo} isLoading={isLoading} />
        
        <div className="bottom-row-inv">
          <StockChart data={chartData} isLoading={isLoading} />
          <UltimosMovimientos data={movimientosRecientes} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

export default DashboardInventario;