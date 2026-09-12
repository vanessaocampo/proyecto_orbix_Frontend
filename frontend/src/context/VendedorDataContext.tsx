import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clientesVendedor,
  productosVendedor,
  ventasVendedor,
  type ClienteVendedor,
  type ProductoVendedor,
  type VentaVendedor,
} from "../data/mockDataVendedor";
import vendedorService from "../services/vendedor.services";

type VendedorDataValue = {
  productos: ProductoVendedor[];
  clientes: ClienteVendedor[];
  ventas: VentaVendedor[];
  cargando: boolean;
  usandoMock: boolean;
  refrescar: () => Promise<void>;
  agregarClienteLocal: (cliente: ClienteVendedor) => void;
};

const VendedorDataContext = createContext<VendedorDataValue | null>(null);

export const VendedorDataProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<ProductoVendedor[]>([]);
  const [clientes, setClientes] = useState<ClienteVendedor[]>([]);
  const [ventas, setVentas] = useState<VentaVendedor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);

  const aplicarDatos = useCallback(
    (
      productosApi: ProductoVendedor[] | null,
      clientesApi: ClienteVendedor[] | null,
      ventasApi: VentaVendedor[] | null,
    ) => {
      setProductos(productosApi ?? []);
      setClientes(clientesApi ?? []);
      setVentas(ventasApi ?? []);
      setUsandoMock(false);
      setCargando(false);
    },
    [],
  );

  const cargarDatos = useCallback(async () => {
    const [productosApi, clientesApi, ventasApi] = await Promise.all([
      vendedorService.obtenerProductos(),
      vendedorService.obtenerClientes(),
      vendedorService.obtenerVentas(),
    ]);

    return { productosApi, clientesApi, ventasApi };
  }, []);

  useEffect(() => {
    let activo = true;

    cargarDatos().then(({ productosApi, clientesApi, ventasApi }) => {
      if (!activo) return;
      aplicarDatos(productosApi, clientesApi, ventasApi);
    });

    return () => {
      activo = false;
    };
  }, [cargarDatos, aplicarDatos]);

  const refrescar = useCallback(async () => {
    const { productosApi, clientesApi, ventasApi } = await cargarDatos();
    aplicarDatos(productosApi, clientesApi, ventasApi);
  }, [cargarDatos, aplicarDatos]);

  const agregarClienteLocal = useCallback((cliente: ClienteVendedor) => {
    setClientes((actuales) => [cliente, ...actuales]);
  }, []);

  return (
    <VendedorDataContext.Provider
      value={{
        productos,
        clientes,
        ventas,
        cargando,
        usandoMock,
        refrescar,
        agregarClienteLocal,
      }}
    >
      {children}
    </VendedorDataContext.Provider>
  );
};

const useVendedorData = () => {
  const contexto = useContext(VendedorDataContext);

  if (!contexto) {
    throw new Error(
      "useVendedorData debe usarse dentro de VendedorDataProvider",
    );
  }

  return contexto;
};

export default useVendedorData;