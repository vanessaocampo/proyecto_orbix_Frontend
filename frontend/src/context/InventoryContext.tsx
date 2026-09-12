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
  refrescar: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);





export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  
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
                  id: m.codigoMovimiento || `MOV-${m.idMovimiento.substring(0,8)}`,
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
        console.error("No se pudo conectar con la BD o la sesión caducó."); setProductos([]); setMovimientos([]);
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
    <InventoryContext.Provider value={{ productos, movimientos, agregarProducto, modificarProducto, registrarMovimiento, refrescar, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within an InventoryProvider");
  return context;
};
