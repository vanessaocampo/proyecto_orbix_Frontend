import { createContext, useContext, useState, type ReactNode } from 'react';

export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMin: number;
  valor: number;
  proveedor: string;
};

export type Movimiento = {
  id: string;
  fecha: string;
  hora: string;
  tipo: string;
  producto: string;
  sku: string;
  cantidad: string;
  isPositive: boolean;
  valor: number;
  responsable: string;
  nota: string;
};

interface InventoryContextType {
  productos: Producto[];
  movimientos: Movimiento[];
  agregarProducto: (prod: Producto) => void;
  registrarMovimiento: (mov: Movimiento, sku: string, cantidadNum: number, tipo: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const initialProductos: Producto[] = [
  { id: "PRD-001", nombre: "Laptop Lenovo IdeaPad 5", categoria: "Electrónica", precio: 8450, stock: 14, stockMin: 5, valor: 118300, proveedor: "Lenovo Argentina" },
  { id: "PRD-002", nombre: "Monitor Samsung 27\" FHD", categoria: "Electrónica", precio: 3200, stock: 8, stockMin: 5, valor: 25600, proveedor: "Samsung Corp" },
  { id: "PRD-003", nombre: "Zapatillas Nike Air Max 270", categoria: "Ropa y calzado", precio: 1890, stock: 3, stockMin: 10, valor: 5670, proveedor: "Nike Distribuidora" },
  { id: "PRD-004", nombre: "Set Utensilios Cocina 12pz", categoria: "Hogar", precio: 4620, stock: 22, stockMin: 5, valor: 101640, proveedor: "Menaje del Sur" },
  { id: "PRD-005", nombre: "Smartphone Samsung Galaxy A55", categoria: "Electrónica", precio: 5900, stock: 19, stockMin: 8, valor: 112100, proveedor: "Samsung Corp" },
  { id: "PRD-006", nombre: "Impresora HP LaserJet Pro", categoria: "Electrónica", precio: 2750, stock: 2, stockMin: 3, valor: 5500, proveedor: "HP Argentina" }
];

const initialMovimientos: Movimiento[] = [
  { id: "MOV-0048", fecha: "30 Jul 2026", hora: "09:14", tipo: "Entrada", producto: "Laptop Lenovo IdeaPad 5", sku: "PRD-001", cantidad: "+10 u.", isPositive: true, valor: 84500, responsable: "Luis Herrera", nota: "Reposición mensual" },
  { id: "MOV-0047", fecha: "30 Jul 2026", hora: "08:32", tipo: "Salida", producto: "Smartphone Samsung Galaxy A55", sku: "PRD-005", cantidad: "+3 u.", isPositive: true, valor: 17700, responsable: "Ana Torres", nota: "ORD-2843" },
  { id: "MOV-0046", fecha: "29 Jul 2026", hora: "16:55", tipo: "Salida", producto: "Monitor Samsung 27\" FHD", sku: "PRD-002", cantidad: "+2 u.", isPositive: true, valor: 6400, responsable: "Diego Ruiz", nota: "ORD-2846" },
  { id: "MOV-0045", fecha: "29 Jul 2026", hora: "14:20", tipo: "Ajuste", producto: "Zapatillas Nike Air Max 270", sku: "PRD-003", cantidad: "-4 u.", isPositive: false, valor: 7560, responsable: "Luis Herrera", nota: "Conteo físico - diferen..." }
];

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>(initialProductos);
  const [movimientos, setMovimientos] = useState<Movimiento[]>(initialMovimientos);

  const agregarProducto = (prod: Producto) => setProductos(prev => [prod, ...prev]);

  const registrarMovimiento = (mov: Movimiento, sku: string, cantidadNum: number, tipo: string) => {
    setMovimientos(prev => [mov, ...prev]);
    
    // Actualizar stock del producto asociado
    setProductos(prev => prev.map(p => {
      // Buscar el producto por SKU exacto, o por nombre si el SKU no coincide perfectamente
      if (p.id === sku || p.nombre.toLowerCase() === mov.producto.toLowerCase()) {
        const nuevoStock = tipo === "Entrada" ? p.stock + cantidadNum : p.stock - cantidadNum;
        return { 
          ...p, 
          stock: Math.max(0, nuevoStock), 
          valor: Math.max(0, nuevoStock) * p.precio 
        };
      }
      return p;
    }));
  };

  return (
    <InventoryContext.Provider value={{ productos, movimientos, agregarProducto, registrarMovimiento }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within an InventoryProvider");
  return context;
};
