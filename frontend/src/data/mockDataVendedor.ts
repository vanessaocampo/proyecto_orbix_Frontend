export type EstadoVenta = "Completada" | "En proceso" | "Pendiente" | "Cancelada";

export type VentaVendedor = {
  id: string;
  cliente: string;
  monto: number;
  estado: EstadoVenta;
  fecha: string;
  items: number;
  pago: "Transferencia" | "Efectivo";
};

export type ProductoVendedor = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  minStock: number;
};

export type ClienteVendedor = {
  id: string;
  nombre: string;
  ciudad: string;
  totalCompras: number;
  pedidos: number;
  ultimo: string;
};

export const ventasMensualesVendedor = [
  { mes: "Ene", ventas: 12400 },
  { mes: "Feb", ventas: 15800 },
  { mes: "Mar", ventas: 11200 },
  { mes: "Abr", ventas: 18600 },
  { mes: "May", ventas: 16900 },
  { mes: "Jun", ventas: 22300 },
  { mes: "Jul", ventas: 19800 },
];

export const metaSemanaVendedor = [
  { dia: "Lun", real: 3200, meta: 4000 },
  { dia: "Mar", real: 4800, meta: 4000 },
  { dia: "Mié", real: 2900, meta: 4000 },
  { dia: "Jue", real: 5600, meta: 4000 },
  { dia: "Vie", real: 4100, meta: 4000 },
  { dia: "Sáb", real: 1800, meta: 4000 },
];

export const actividadRecienteVendedor = [
  { accion: "Venta registrada", cliente: "María García", monto: 1890, hora: "Hace 20 min" },
  { accion: "Nuevo cliente", cliente: "Roberto Fuentes", monto: null, hora: "Hace 1 h" },
  { accion: "Venta registrada", cliente: "Juan Méndez", monto: 5900, hora: "Hace 3 h" },
  { accion: "Venta registrada", cliente: "Ferretería Central", monto: 3800, hora: "Ayer" },
];

export const ventasVendedor: VentaVendedor[] = [
  { id: "ORD-2846", cliente: "Distribuidora Norte", monto: 3200, estado: "En proceso", fecha: "30 Jul 2026", items: 1, pago: "Transferencia" },
  { id: "ORD-2843", cliente: "Juan Méndez", monto: 5900, estado: "Pendiente", fecha: "28 Jul 2026", items: 1, pago: "Efectivo" },
  { id: "ORD-2840", cliente: "Ferretería Central", monto: 3800, estado: "Completada", fecha: "26 Jul 2026", items: 3, pago: "Efectivo" },
];

export const productosVendedor: ProductoVendedor[] = [
  { id: "PRD-001", nombre: "Laptop Lenovo IdeaPad 5", categoria: "Electrónica", precio: 8450, stock: 14, minStock: 5 },
  { id: "PRD-002", nombre: "Monitor Samsung 27\" FHD", categoria: "Electrónica", precio: 3200, stock: 8, minStock: 5 },
  { id: "PRD-003", nombre: "Zapatillas Nike Air Max 270", categoria: "Ropa y calzado", precio: 1890, stock: 3, minStock: 10 },
  { id: "PRD-004", nombre: "Set Utensilios Cocina 12pz", categoria: "Hogar", precio: 4620, stock: 22, minStock: 5 },
  { id: "PRD-005", nombre: "Smartphone Samsung Galaxy A55", categoria: "Electrónica", precio: 5900, stock: 19, minStock: 8 },
  { id: "PRD-006", nombre: "Impresora HP LaserJet Pro", categoria: "Electrónica", precio: 2750, stock: 2, minStock: 3 },
  { id: "PRD-007", nombre: "Auriculares Sony WH-1000XM5", categoria: "Electrónica", precio: 4100, stock: 11, minStock: 5 },
  { id: "PRD-008", nombre: "Remera Adidas Originals", categoria: "Ropa y calzado", precio: 680, stock: 45, minStock: 15 },
  { id: "PRD-009", nombre: "Horno Electrico Sindelen 45L", categoria: "Hogar", precio: 1340, stock: 7, minStock: 5 },
  { id: "PRD-010", nombre: "Arroz Largo Fino x5kg", categoria: "Alimentos", precio: 320, stock: 88, minStock: 20 },
  { id: "PRD-011", nombre: "Aceite de Oliva Extra Virgen", categoria: "Alimentos", precio: 540, stock: 62, minStock: 15 },
  { id: "PRD-012", nombre: "Teclado Mecánico Logitech G413", categoria: "Electrónica", precio: 1950, stock: 4, minStock: 5 },
];

export const clientesVendedor: ClienteVendedor[] = [
  { id: "CLI-001", nombre: "Tech Solutions SRL", ciudad: "Buenos Aires", totalCompras: 42800, pedidos: 12, ultimo: "30 Jul 2026" },
  { id: "CLI-002", nombre: "Distribuidora Norte", ciudad: "Rosario", totalCompras: 38500, pedidos: 28, ultimo: "30 Jul 2026" },
  { id: "CLI-005", nombre: "Juan Méndez", ciudad: "Córdoba", totalCompras: 14200, pedidos: 7, ultimo: "28 Jul 2026" },
  { id: "CLI-006", nombre: "Grupo Empresarial BC", ciudad: "Buenos Aires", totalCompras: 65400, pedidos: 34, ultimo: "28 Jul 2026" },
  { id: "CLI-008", nombre: "Ferretería Central", ciudad: "Salta", totalCompras: 18900, pedidos: 14, ultimo: "22 Jul 2026" },
];