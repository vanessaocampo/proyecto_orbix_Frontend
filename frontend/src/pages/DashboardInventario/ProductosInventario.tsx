import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import "../../components/dashboardInventario/ModalInventario.css";
import "./ProductosInventario.css";
import { useInventory } from "../../context/InventoryContext";

const categories = ["Todas", "Electrónica", "Ropa y calzado", "Alimentos", "Hogar"];
const statuses = ["Todos", "Disponible", "Stock bajo", "Sin stock"];

const ProductosInventario = () => {
  const { productos, agregarProducto } = useInventory();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoria: "Electrónica",
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
  const handleAgregarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoId = `PRD-00${productos.length + 1}`;
    const pPrecio = Number(nuevoProducto.precio);
    const pStock = Number(nuevoProducto.stock);
    
    const productoAgregado = {
      id: nuevoId,
      nombre: nuevoProducto.nombre,
      categoria: nuevoProducto.categoria,
      precio: pPrecio,
      stock: pStock,
      stockMin: Number(nuevoProducto.stockMin),
      valor: pPrecio * pStock,
      proveedor: nuevoProducto.proveedor
    };

    agregarProducto(productoAgregado);
    setIsModalOpen(false);
    
    // Resetear form
    setNuevoProducto({ nombre: "", categoria: "Electrónica", precio: "", stock: "", stockMin: "", proveedor: "" });
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
                      <button className="btn-ajustar">Ajustar</button>
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
                <div className="form-group-inv">
                  <label>Nombre del Producto</label>
                  <input type="text" required placeholder="Ej. Teclado Inalámbrico" 
                    value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
                </div>
                
                <div className="form-row">
                  <div className="form-group-inv">
                    <label>Categoría</label>
                    <select value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}>
                      <option value="Electrónica">Electrónica</option>
                      <option value="Ropa y calzado">Ropa y calzado</option>
                      <option value="Alimentos">Alimentos</option>
                      <option value="Hogar">Hogar</option>
                    </select>
                  </div>
                  <div className="form-group-inv">
                    <label>Precio Unitario ($)</label>
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

                <div className="form-group-inv">
                  <label>Proveedor</label>
                  <input type="text" required placeholder="Nombre de la empresa proveedora" 
                    value={nuevoProducto.proveedor} onChange={(e) => setNuevoProducto({...nuevoProducto, proveedor: e.target.value})} />
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
