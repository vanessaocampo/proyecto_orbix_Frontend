import "./TablaEmpleados.css";

interface TablaEmpleadosProps {
  filtro: string;
  busqueda: string;
}

interface Empleado {
  empleado: string;
  id: string;
  correo: string;
  telefono: string;
  ciudad: string;
  rol: string;
  estado: string;
  fecha_ingreso: string;
}

const empleados: Empleado[] = [
  {
    empleado: "Ana Torres",
    id: "EMP-001",
    correo: "atorres@orbix.com",
    telefono: "+54 11 4823-7621",
    ciudad: "Buenos Aires",
    rol: "Vendedor",
    estado: "Activo",
    fecha_ingreso: "12 Mar 2024",
  },
  {
    empleado: "Diego Ruiz",
    id: "EMP-002",
    correo: "druiz@orbix.com",
    telefono: "+54 11 5510-3344",
    ciudad: "Buenos Aires",
    rol: "Vendedor",
    estado: "Activo",
    fecha_ingreso: "05 Jun 2024",
  },
  {
    empleado: "Luis Herrera",
    id: "EMP-003",
    correo: "lherrera@orbix.com",
    telefono: "+54 341 482-9341",
    ciudad: "Rosario",
    rol: "Inventario",
    estado: "Activo",
    fecha_ingreso: "20 Ene 2025",
  },
  {
    empleado: "Sofia Méndez",
    id: "EMP-004",
    correo: "smendez@orbix.com",
    telefono: "+54 351 368-4421",
    ciudad: "Córdoba",
    rol: "Inventario",
    estado: "Activo",
    fecha_ingreso: "08 Abr 2025",
  },
  {
    empleado: "Carlos Vidal",
    id: "EMP-005",
    correo: "cvidal@orbix.com",
    telefono: "+54 223 432-5541",
    ciudad: "Mar del Plata",
    rol: "Vendedor",
    estado: "Inactivo",
    fecha_ingreso: "14 Nov 2023",
  },
];

const TablaEmpleados = ({ filtro, busqueda }: TablaEmpleadosProps) => {
  const textoBusqueda = busqueda.toLocaleLowerCase().trim();

  const empleadosFiltrados = empleados.filter((Empleado) => {
    const coincideRol = filtro === "Todos" || Empleado.rol === filtro;

    const coincideBusqueda =
      Empleado.empleado.toLocaleLowerCase().includes(textoBusqueda) ||
      Empleado.id.toLocaleLowerCase().includes(textoBusqueda) ||
      Empleado.correo.toLocaleLowerCase().includes(textoBusqueda) ||
      Empleado.ciudad.toLocaleLowerCase().includes(textoBusqueda);

    return coincideRol && coincideBusqueda;
  });

  return (
    <section className="tabla-empleados-wrapper">
      <div className="tabla-empleados-contenedor">
        <table className="tabla-empleados">
          <thead>
            <tr>
              <th>EMPLEADO</th>
              <th>CONTACTO</th>
              <th>CIUDAD</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>FECHA INGRESO</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {empleadosFiltrados.map((Empleado) => {
              const iniciales = Empleado.empleado
                .split(" ")
                .slice(0, 2)
                .map((nombre) => nombre[0])
                .join("");

              return (
                <tr key={Empleado.id}>
                  <td className="empleado-info">
                    <div className="empleado-contenido">
                      <div className="empleado-avatar">{iniciales}</div>

                      <div className="empleado-datos">
                        <span className="empleado-nombre">
                          {Empleado.empleado}
                        </span>

                        <span className="empleado-id">{Empleado.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="contacto-empleado-info">
                    <div className="contacto-empleado-datos">
                      <span className="contacto-empleado-correo">
                        {Empleado.correo}
                      </span>

                      <span className="contacto-empleado-telefono">
                        {Empleado.telefono}
                      </span>
                    </div>
                  </td>

                  <td className="ciudad-empleado-info">{Empleado.ciudad}</td>

                  <td className="rol-empleado-info">
                    <span
                      className={
                        Empleado.rol === "Vendedor"
                          ? "rol-vendedor"
                          : "rol-cajero"
                      }
                    >
                      {Empleado.rol}
                    </span>
                  </td>

                  <td className="estado-empleado-info">
                    <span
                      className={
                        Empleado.estado === "Activo"
                          ? "estado-activo"
                          : "estado-inactivo"
                      }
                    >
                      {Empleado.estado}
                    </span>
                  </td>

                  <td className="fecha-empleado-info">
                    {Empleado.fecha_ingreso}
                  </td>

                  <td className="editar-empleado-info">
                    <button className="boton-editar-empleado">Editar</button>
                  </td>
                </tr>
              );
            })}

            {empleadosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="empleados-sin-resultados">
                  No se encontraron empleados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TablaEmpleados;
