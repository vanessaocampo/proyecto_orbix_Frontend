import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Producto = {
  id: string;
  dbId?: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  precioCompra?: number;
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
  loading: boolean;
  agregarProducto: (prod: Producto) => void;
  modificarProducto: (prod: Producto) => void;
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
  
  // Agregar un estado para saber si est cargando
  const [loading, setLoading] = useState(false);
  const [defaultCatId, setDefaultCatId] = useState<string|undefined>();
  const [defaultProvId, setDefaultProvId] = useState<string|undefined>();

  // Hook para cargar datos reales de la BD al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token"); // Si no hay token, usa los de prueba
        
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // 0. Cargar Cat/Prov
        const [resCat, resProv] = await Promise.all([
          fetch('http://localhost:3000/api/v1/categorias', { headers }),
          fetch('http://localhost:3000/api/v1/proveedores', { headers })
        ]);
        if (resCat.ok) { const d = await resCat.json(); if (d.data?.length > 0) setDefaultCatId(d.data[0].idCategoria); }
        if (resProv.ok) { const d = await resProv.json(); if (d.data?.length > 0) setDefaultProvId(d.data[0].idProveedor); }

        // 1. Cargar Productos reales
        const resProd = await fetch('http://localhost:3000/api/v1/productos', { headers });
        if (resProd.ok) {
          const dataProd = await resProd.json();
          if (dataProd.success && dataProd.data.length > 0) {
            const prodMapeados: Producto[] = dataProd.data.map((p: any) => ({
              id: p.sku || `PRD-${p.idProducto.substring(0,6)}`,
              dbId: p.idProducto,
              nombre: p.nombre,
              categoria: p.categoria?.nombre || 'General',
              descripcion: p.descripcion,
              precioCompra: p.precioCompra ? Number(p.precioCompra) : undefined,
              precio: Number(p.precio),
              stock: p.stock,
              stockMin: p.stockMinimo,
              valor: Number(p.precio) * p.stock,
              proveedor: p.proveedor?.nombre || 'Local'
            }));
            setProductos(prodMapeados);
          }
        }

        // 2. Cargar Movimientos reales
        const resMov = await fetch('http://localhost:3000/api/v1/inventario/movimientos', { headers });
        if (resMov.ok) {
           const dataMov = await resMov.json();
           if (dataMov.success && dataMov.data.length > 0) {
              const movMapeados: Movimiento[] = dataMov.data.map((m: any) => {
                const dateObj = new Date(m.fecha);
                return {
                  id: `MOV-${m.idMovimiento}`,
                  fecha: dateObj.toLocaleDateString(),
                  hora: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  tipo: m.tipo === 'entrada' ? 'Entrada' : m.tipo === 'salida' ? 'Salida' : m.tipo === 'ajuste' ? 'Ajuste' : 'Devolucion',
                  producto: m.producto?.nombre || 'Desconocido',
                  sku: m.producto?.sku || 'N/A',
                  cantidad: (m.tipo === 'entrada' || m.tipo === 'devolucion' ? '+' : '-') + m.cantidad + ' u.',
                  isPositive: m.tipo === 'entrada' || m.tipo === 'devolucion',
                  valor: m.cantidad * Number(m.producto?.precio || 0),
                  responsable: m.usuario?.nombre || 'Sistema',
                  nota: m.referencia || 'N/A'
                };
              });
              setMovimientos(movMapeados);
           }
        }
      } catch (error) {
        console.warn("No se pudo conectar con la BD en NEON o no hay sesion. Usando Mock Data.");
        // Fallback silencioso a initialProductos y initialMovimientos (Mock Data)
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const agregarProducto = async (prod: Producto) => {
    // 1. Actualización UI inmediata (Optimistic update)
    setProductos(prev => [prod, ...prev]);

    // 2. Sincronización con Base de Datos
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = {
          sku: prod.id,
          nombre: prod.nombre,
          descripcion: prod.descripcion || null,
          precioCompra: prod.precioCompra || 0,
          precio: prod.precio,
          stock: prod.stock,
          stockMinimo: prod.stockMin,
          // Para no romper las llaves foráneas, usamos IDs genéricos o intentamos mapear
          idCategoria: defaultCatId, 
          idProveedor: defaultProvId
        };
        await fetch('http://localhost:3000/api/v1/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      console.error("Error al guardar el producto en la BD", e);
    }
  };

  
  const modificarProducto = async (prod: Producto) => {
    setProductos(prev => prev.map(p => p.id === prod.id ? prod : p));
    try {
      const token = localStorage.getItem('token');
      if (token && prod.dbId) {
        const payload = {
          sku: prod.id,
          nombre: prod.nombre,
          descripcion: prod.descripcion || null,
          precioCompra: prod.precioCompra || 0,
          precio: prod.precio,
          stock: prod.stock,
          stockMinimo: prod.stockMin,
        };
        await fetch(`http://localhost:3000/api/v1/productos/${prod.dbId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      console.error("Error al modificar el producto en la BD", e);
    }
  };

  const registrarMovimiento = async (mov: Movimiento, sku: string, cantidadNum: number, tipo: string) => {
    setMovimientos(prev => [mov, ...prev]);
    
    // Actualizar stock del producto asociado localmente (el backend lo har tambin)
    let prodEncontrado: Producto | undefined;
    setProductos(prev => prev.map(p => {
      if (p.id === sku || p.nombre.toLowerCase() === mov.producto.toLowerCase()) {
        prodEncontrado = p;
        const nuevoStock = tipo === "Entrada" ? p.stock + cantidadNum : p.stock - cantidadNum;
        return { 
          ...p, 
          stock: Math.max(0, nuevoStock), 
          valor: Math.max(0, nuevoStock) * p.precio 
        };
      }
      return p;
    }));

    // Sincronizar con la BD
    try {
      const token = localStorage.getItem('token');
      if (token && prodEncontrado && prodEncontrado.dbId) {
        const rawId = prodEncontrado.id.replace('PRD-', '');
        const idProducto = parseInt(rawId) || 1;
        const endpointTipo = tipo.toLowerCase() === 'entrada' ? 'entrada' : tipo.toLowerCase() === 'salida' ? 'salida' : 'ajuste';
        
        await fetch(`http://localhost:3000/api/v1/inventario/${endpointTipo}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            idProducto,
            cantidad: cantidadNum,
            referencia: mov.nota || 'Registrado desde Dashboard'
          })
        });
      }
    } catch (e) {
      console.error("Error al guardar el movimiento en la BD", e);
    }
  };

  return (
    <InventoryContext.Provider value={{ productos, movimientos, agregarProducto, modificarProducto, registrarMovimiento, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within an InventoryProvider");
  return context;
};
