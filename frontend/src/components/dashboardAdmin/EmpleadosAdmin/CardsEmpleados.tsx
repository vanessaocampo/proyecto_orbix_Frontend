import "./CardsEmpleados.css";

const CardsEmpleados = () => {
  return (
    <section className="cards-empleados">

      <div className="card-empleado">
        <div className="card-empleado-titulo">
          <span className="punto-verde"></span>
          <span>Total empleados</span>
        </div>

        <h3>5</h3>
      </div>

      <div className="card-empleado">
        <div className="card-empleado-titulo">
          <span className="punto-morado"></span>
          <span>Vendedores</span>
        </div>

        <h3>3</h3>
      </div>

      <div className="card-empleado">
        <div className="card-empleado-titulo">
          <span className="punto-azul"></span>
          <span>Inventario</span>
        </div>

        <h3>2</h3>
      </div>

      <div className="card-empleado">
        <div className="card-empleado-titulo">
          <span className="punto-gris"></span>
          <span>Inactivos</span>
        </div>

        <h3>1</h3>
      </div>

    </section>
  );
};

export default CardsEmpleados;