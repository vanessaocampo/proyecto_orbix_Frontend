import {
  CircleDollarSign,
  ShoppingBag,
  UsersRound,
  BriefcaseBusiness,
} from "lucide-react";

import { useEffect, useState } from "react";

import ventasService from "../../services/ventas.services";
import clienteService from "../../services/clientes.services";
import inventarioService from "../../services/inventario.services";

import "./CarsDatos.css";

const CarsDatos = () => {
  const [ingresosDelMes, setIngresosDelMes] = useState<number>(0);
  const [pedidosTotales, setPedidosTotales] = useState<number>(0);
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [valorInventario, setValorInventario] = useState<number>(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [ventas, clientes, valorStock] =
          await Promise.all([
            ventasService.obtenerVentas(),
            clienteService.obtenerClientes(),
            inventarioService.obtenerValorInventario(),
          ]);

        // PEDIDOS TOTALES:
        // solamente pedidos completados
        const pedidosCompletados = ventas.filter(
          (venta) =>
            venta.estado.toLowerCase() === "completada"
        );

        setPedidosTotales(pedidosCompletados.length);

        // TOTAL DE CLIENTES
        setTotalClientes(clientes.length);

        // INGRESOS DEL MES:
        // solamente ventas completadas
        // del mes y año actual
        const ahora = new Date();

        const mesActual = ahora.getMonth();
        const añoActual = ahora.getFullYear();

        const ingresos = ventas
          .filter((venta) => {
            const fechaVenta = new Date(venta.fecha);

            return (
              fechaVenta.getMonth() === mesActual &&
              fechaVenta.getFullYear() === añoActual &&
              venta.estado.toLowerCase() === "completada"
            );
          })
          .reduce((total, venta) => {
            return total + Number(venta.total);
          }, 0);

        setIngresosDelMes(ingresos);

        // VALOR TOTAL DEL INVENTARIO
        setValorInventario(valorStock);

      } catch (error) {
        console.error(
          "Error al cargar los datos del dashboard:",
          error
        );
      }
    };

    cargarDatos();
  }, []);

  const datos = [
    {
      titulo: "Ingresos del mes",
      valor: `$${ingresosDelMes.toLocaleString("es-CO")}`,
      icon: CircleDollarSign,
    },
    {
      titulo: "Pedidos",
      valor: pedidosTotales.toString(),
      icon: ShoppingBag,
    },
    {
      titulo: "Clientes actuales",
      valor: totalClientes.toString(),
      icon: UsersRound,
    },
    {
      titulo: "Valor de inventario",
      valor: `$${valorInventario.toLocaleString("es-CO")}`,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <div className="dashboard-cards">
      {datos.map((dato) => {
        const Icono = dato.icon;

        return (
          <div
            className="card"
            key={dato.titulo}
          >
            <div className="titulo-cars">
              <p>{dato.titulo}</p>
              <Icono size={24} />
            </div>

            <h2>{dato.valor}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default CarsDatos;