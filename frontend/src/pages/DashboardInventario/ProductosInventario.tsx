import { useState, useEffect } from "react";
import { Search, Plus, X, RefreshCcw, Loader2, Edit, Trash2 } from "lucide-react";
import "../../components/dashboardInventario/ModalInventario.css";
import "./ProductosInventario.css";
import { useInventory } from "../../context/InventoryContext";

const categories = ["Todas", "Electrónica", "Ropa y calzado", "Alimentos", "Hogar"];
const statuses = ["Todos", "Disponible", "Stock bajo", "Sin stock"];

const ProductosInventario = () => {
  const { productos, agregarProducto, modificarProducto, refrescar, loading } = useInventory();

  useEffect(() => {
    refrescar();
  }, []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<any>(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    sku: "",
    nombre: "",
    descripcion: "",
    categoria: "Electrónica",
    precioCompra: "",
    precio: "",
    stock: "",
    stockMin: "",
    proveedor: ""
  });

  // Lógica de filtrado
  const filteredProductos = productos.filter((prod) => {
    const matchesSearch =
      prod.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Todas" || prod.categoria === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === "Disponible") matchesStatus = prod.stock > prod.stockMin;
    if (selectedStatus === "Stock bajo") matchesStatus = prod.stock <= prod.stockMin && prod.stock > 0;
    if (selectedStatus === "Sin stock") matchesStatus = prod.stock === 0;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Manejar creación de producto
  
  const handleEditClick = (prod: any) => {
    setProductoAEditar(prod);
    setNuevoProducto({
      sku: prod.id,
      nombre: prod.nombre,
      descripcion: prod.descripcion || "",
      categoria: prod.categoria,
      precioCompra: prod.precioCompra || "",
      precio: prod.precio,
      stock: prod.stock,
      stockMin: prod.stockMin,
      proveedor: prod.proveedor
    });
    setIsEditModalOpen(true);
  };

  const handleModificarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoAEditar) return;
    
    const pPrecio = Number(nuevoProducto.precio);
    const pStock = Number(nuevoProducto.stock);
    
    const productoModificado = {
      ...productoAEditar,
      nombre: nuevoProducto.nombre,
      descripcion: nuevoProducto.descripcion,
      categoria: nuevoProducto.categoria,
      precioCompra: nuevoProducto.precioCompra ? Number(nuevoProducto.precioCompra) : undefined,
      precio: pPrecio,
      stock: pStock,
      stockMin: Number(nuevoProducto.stockMin),
      valor: pPrecio * pStock,
      proveedor: nuevoProducto.proveedor
    };

    modificarProducto(productoModificado);
    setIsEditModalOpen(false);
    setProductoAEditar(null);
    setNuevoProducto({ sku: "", nombre: "", descripcion: "", categoria: "Electrónica", precioCompra: "", precio: "", stock: "", stockMin: "", proveedor: "" });
  };

  const handleAgregarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoId = nuevoProducto.sku || `PRD-00${productos.length + 1}`;
    const pPrecio = Number(nuevoProducto.precio);
    const pStock = Number(nuevoProducto.stock);
    
    const productoAgregado = {
      id: nuevoId,
      nombre: nuevoProducto.nombre,
      descripcion: nuevoProducto.descripcion,
      categoria: nuevoProducto.categoria,
      precioCompra: nuevoProducto.precioCompra ? Number(nuevoProducto.precioCompra) : undefined,
      precio: pPrecio,
      stock: pStock,
      stockMin: Number(nuevoProducto.stockMin),
      valor: pPrecio * pStock,
      proveedor: nuevoProducto.proveedor
    };

    agregarProducto(productoAgregado);
    setIsModalOpen(false);
    
    // Resetear form
    setNuevoProducto({ sku: "", nombre: "", descripcion: "", categoria: "Electrónica", precioCompra: "", precio: "", stock: "", stockMin: "", proveedor: "" });
  };

  // Calcular valor total de filtrados
  const totalValor = filteredProductos.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <>
      <div className="productos-header">
        <div className="productos-title">
          <h2>Productos</h2>
          <p>{filteredProductos.length} productos · valor total $ {totalValor.toLocaleString('es-AR')}</p>
        </div>
        <div className="productos-actions">
          <button className="btn-outline" onClick={() => refrescar()} disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : <RefreshCcw size={18} />} Actualizar
          </button>
          <button className="btn-outline">Importar</button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Agregar producto
          </button>
        </div>
      </div>
      
      <div className="filters-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Buscar producto o código..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-pills">
          {categories.map((cat) => (
            <button 
              key={cat} 
              className={`pill ${selectedCategory === cat ? 'active-green' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="filter-pills" style={{ marginLeft: 'auto' }}>
          {statuses.map((stat) => (
            <button 
              key={stat} 
              className={`pill ${selectedStatus === stat ? 'active-dark' : ''}`}
              onClick={() => setSelectedStatus(stat)}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>PRODUCTO</th>
              <th>CATEGORÍA</th>
              <th>PRECIO</th>
              <th>STOCK</th>
              <th>STOCK MÍN.</th>
              <th>VALOR EN STOCK</th>
              <th>PROVEEDOR</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length > 0 ? (
              filteredProductos.map((prod, index) => {
                const statusClass = prod.stock === 0 ? 'out' : (prod.stock <= prod.stockMin ? 'low' : 'good');
                const fillWidth = Math.min((prod.stock / (prod.stockMin * 3)) * 100, 100);

                return (
                  <tr key={index}>
                    <td className="text-green">{prod.id}</td>
                    <td className="text-dark">{prod.nombre}</td>
                    <td className="text-gray">{prod.categoria}</td>
                    <td className="text-dark">$ {prod.precio.toLocaleString('es-AR')}</td>
                    <td>
                      <div className="stock-bar-container">
                        <div className="stock-bar">
                          <div className={`stock-bar-fill ${statusClass}`} style={{ width: `${fillWidth}%` }}></div>
                        </div>
                        <span className={`stock-number ${statusClass}`}>{prod.stock}</span>
                      </div>
                    </td>
                    <td className="text-gray">{prod.stockMin}</td>
                    <td className="text-dark">$ {prod.valor.toLocaleString('es-AR')}</td>
                    <td className="text-gray">{prod.proveedor}</td>
                    <td>
                      <button className="btn-ajustar" onClick={() => handleEditClick(prod)}>Editar</button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  No se encontraron productos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar Producto */}
      
      {/* Modal para Editar Producto */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Modificar Producto</h3>
              <button className="close-btn" onClick={() => { setIsEditModalOpen(false); setProductoAEditar(null); setNuevoProducto({ sku: "", nombre: "", descripcion: "", categoria: "Electrónica", precioCompra: "", precio: "", stock: "", stockMin: "", proveedor: "" }); }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleModificarProducto}>
              <div className="form-row">
                <div className="form-group-inv">
                  <label>SKU</label>
                  <input type="text" placeholder="Ej. PRD-001" disabled value={nuevoProducto.sku} />
                </div>
                
                <div className="form-group-inv">
                  <label>Nombre del Producto</label>
                  <input type="text" placeholder="Ej. Monitor Samsung 27 pulg" required value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
                </div>
              </div>

              <div className="form-group-inv">
                <label>Descripción</label>
                <textarea placeholder="Breve descripción del producto..." rows={2} style={{width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0'}} value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})} />
              </div>
              
              <div className="form-row">
                <div className="form-group-inv">
                  <label>Categoría</label>
                  <select value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}>
                    <option>Electrónica</option>
                    <option>Ropa y calzado</option>
                    <option>Hogar</option>
                    <option>Alimentos</option>
                  </select>
                </div>
                
                <div className="form-group-inv">
                  <label>Proveedor</label>
                  <input type="text" placeholder="Proveedor del producto" value={nuevoProducto.proveedor} onChange={(e) => setNuevoProducto({...nuevoProducto, proveedor: e.target.value})} />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group-inv">
                  <label>Precio Compra ($)</label>
                  <input type="number" placeholder="0" value={nuevoProducto.precioCompra} onChange={(e) => setNuevoProducto({...nuevoProducto, precioCompra: e.target.value})} />
                </div>

                <div className="form-group-inv">
                  <label>Precio Venta ($)</label>
                  <input type="number" placeholder="0" required value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group-inv">
                  <label>Stock Actual</label>
                  <input type="number" placeholder="0" required value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})} />
                </div>
                
                <div className="form-group-inv">
                  <label>Stock Mínimo</label>
                  <input type="number" placeholder="0" required value={nuevoProducto.stockMin} onChange={(e) => setNuevoProducto({...nuevoProducto, stockMin: e.target.value})} />
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => { setIsEditModalOpen(false); setProductoAEditar(null); setNuevoProducto({ sku: "", nombre: "", descripcion: "", categoria: "Electrónica", precioCompra: "", precio: "", stock: "", stockMin: "", proveedor: "" }); }}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Agregar Nuevo Producto</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAgregarProducto}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group-inv">
                    <label>Código SKU (Opcional)</label>
                    <input type="text" placeholder="Ej. PRD-123" 
                      value={nuevoProducto.sku} onChange={(e) => setNuevoProducto({...nuevoProducto, sku: e.target.value})} />
                  </div>
                  <div className="form-group-inv">
                    <label>Nombre del Producto</label>
                    <input type="text" required placeholder="Ej. Teclado Inalámbrico" 
                      value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
                  </div>
                </div>

                <div className="form-group-inv">
                  <label>Descripción</label>
                  <textarea placeholder="Breve descripción del producto..." rows={2} style={{width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0'}}
                    value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})} />
                </div>
                
                <div className="form-row">
                  <div className="form-group-inv">
                    <label>Categoría</label>
                    <select value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}>
                      <option value="Abarrotes">Abarrotes</option>
                      <option value="Aseo">Aseo</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Papelería">Papelería</option>
                      <option value="Electrónica">Electrónica</option>
                      <option value="Ropa y calzado">Ropa y calzado</option>
                      <option value="Hogar">Hogar</option>
                    </select>
                  </div>
                  <div className="form-group-inv">
                    <label>Proveedor</label>
                    <input type="text" required placeholder="Nombre de la empresa proveedora" 
                      value={nuevoProducto.proveedor} onChange={(e) => setNuevoProducto({...nuevoProducto, proveedor: e.target.value})} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-inv">
                    <label>Precio Compra ($)</label>
                    <input type="number" min="0" placeholder="0.00" 
                      value={nuevoProducto.precioCompra} onChange={(e) => setNuevoProducto({...nuevoProducto, precioCompra: e.target.value})} />
                  </div>
                  <div className="form-group-inv">
                    <label>Precio Venta ($)</label>
                    <input type="number" required min="0" placeholder="0.00" 
                      value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-inv">
                    <label>Stock Inicial</label>
                    <input type="number" required min="0" placeholder="0" 
                      value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})} />
                  </div>
                  <div className="form-group-inv">
                    <label>Stock Mínimo</label>
                    <input type="number" required min="0" placeholder="0" 
                      value={nuevoProducto.stockMin} onChange={(e) => setNuevoProducto({...nuevoProducto, stockMin: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductosInventario;

