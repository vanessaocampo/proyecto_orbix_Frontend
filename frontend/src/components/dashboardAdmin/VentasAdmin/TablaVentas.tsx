import "./TablaVentas.css";

interface TablaVentasProps {
  filtro: string;
  busqueda: string;
}

interface Venta {
  pedido: string;
  cliente: string;
  vendedor: string;
  items: number;
  monto: number;
  pago: string;
  estado: string;
}

const ventas: Venta[] = [
  {
    pedido: "ORD-2847",
    cliente: "Tech Solutions SRL",
    vendedor: "Ana Torres",
    items: 2,
    monto: 8450,
    pago: "Transferencia",
    estado: "Completada",
  },
  {
    pedido: "ORD-2846",
    cliente: "Distribuidora Norte",
    vendedor: "Diego Ruiz",
    items: 1,
    monto: 3200,
    pago: "Transferencia",
    estado: "En proceso",
  },
  {
    pedido: "ORD-2845",
    cliente: "María García",
    vendedor: "Ana Torres",
    items: 1,
    monto: 1890,
    pago: "Efectivo",
    estado: "Completada",
  },
  {
    pedido: "ORD-2844",
    cliente: "Comercial Del Sur",
    vendedor: "Luis Herrera",
    items: 4,
    monto: 4620,
    pago: "Transferencia",
    estado: "Pendiente",
  },
  {
    pedido: "ORD-2843",
    cliente: "Juan Méndez",
    vendedor: "Diego Ruiz",
    items: 1,
    monto: 5900,
    pago: "Efectivo",
    estado: "Pendiente",
  },
  {
    pedido: "ORD-2842",
    cliente: "Grupo Empresarial BC",
    vendedor: "Luis Herrera",
    items: 1,
    monto: 2750,
    pago: "Transferencia",
    estado: "Cancelada",
  },
  {
    pedido: "ORD-2841",
    cliente: "Supermercado La Unión",
    vendedor: "Ana Torres",
    items: 8,
    monto: 12400,
    pago: "Transferencia",
    estado: "Completada",
  },
  {
    pedido: "ORD-2840",
    cliente: "Ferretería Central",
    vendedor: "Diego Ruiz",
    items: 3,
    monto: 3800,
    pago: "Efectivo",
    estado: "En proceso",
  },
  {
    pedido: "ORD-2839",
    cliente: "Tech Solutions SRL",
    vendedor: "Luis Herrera",
    items: 2,
    monto: 9700,
    pago: "Transferencia",
    estado: "Completada",
  },
  {
    pedido: "ORD-2838",
    cliente: "Distribuidora Norte",
    vendedor: "Ana Torres",
    items: 5,
    monto: 6300,
    pago: "Efectivo",
    estado: "Completada",
  },
];

const TablaVentas = ({ filtro, busqueda }: TablaVentasProps) => {
  const textoBusqueda = busqueda.toLowerCase().trim();

  const ventasFiltradas = ventas.filter((venta) => {
    const coincideEstado = filtro === "Todos" || venta.estado === filtro;

    const coincideBusqueda =
      venta.pedido.toLowerCase().includes(textoBusqueda) ||
      venta.cliente.toLowerCase().includes(textoBusqueda) ||
      venta.vendedor.toLowerCase().includes(textoBusqueda);

    return coincideEstado && coincideBusqueda;
  });

  return (
    <section className="tabla-ventas-wrapper">
      <div className="tabla-ventas-contenedor">
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>N° PEDIDO</th>
              <th>CLIENTE</th>
              <th>VENDEDOR</th>
              <th>ITEMS</th>
              <th>MONTO</th>
              <th>PAGO</th>
              <th>ESTADO</th>
            </tr>
          </thead>

          <tbody>
            {ventasFiltradas.map((venta) => (
              <tr key={venta.pedido}>
                <td className="pedido-venta">{venta.pedido}</td>

                <td className="cliente-venta">{venta.cliente}</td>

                <td className="vendedor-venta">{venta.vendedor}</td>

                <td className="items-venta">{venta.items}</td>

                <td className="monto-venta">
                  $ {venta.monto.toLocaleString("es-CO")}
                </td>

                <td>
                  <span
                    className={
                      venta.pago === "Efectivo"
                        ? "pago-efectivo"
                        : "pago-transferencia"
                    }
                  >
                    {venta.pago}
                  </span>
                </td>

                <td>
                  <span
                    className={`estado-venta estado-${venta.estado
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {venta.estado}
                  </span>
                </td>
              </tr>
            ))}

            {ventasFiltradas.length === 0 && (
              <tr>
                <td colSpan={7} className="ventas-sin-resultados">
                  No se encontraron ventas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TablaVentas;