import { useEffect, useState } from "react";
import api from "../api/api";
import "./Contabilidad.css";

const Contabilidad = () => {

  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const obtenerDatos = async () => {

    try {

      setCargando(true);
      setError("");

      const response = await api.get(
        "/pedidos/contabilidad"
      );

      setDatos(response.data);

    } catch (error) {

      console.error(
        "Error al obtener contabilidad:",
        error
      );

      setError(
        error.response?.data?.error ||
        "No se pudo cargar la contabilidad"
      );

    } finally {

      setCargando(false);

    }

  };


  useEffect(() => {
    obtenerDatos();
  }, []);


  const dinero = (numero) => {

    return Number(numero || 0).toLocaleString(
      "es-AR",
      {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2
      }
    );

  };


  const fecha = (fechaPedido) => {

    if (!fechaPedido) {
      return "";
    }

    return new Date(
      fechaPedido
    ).toLocaleDateString("es-AR");

  };


  const nombreDia = (fechaString) => {

    const fecha = new Date(
      `${fechaString}T12:00:00`
    );

    return fecha.toLocaleDateString(
      "es-AR",
      {
        weekday: "short"
      }
    );

  };


  if (cargando) {

    return (
      <div className="contabilidad-container">

        <h1>📊 Contabilidad</h1>

        <div className="contabilidad-cargando">
          Cargando información...
        </div>

      </div>
    );

  }


  if (error) {

    return (
      <div className="contabilidad-container">

        <h1>📊 Contabilidad</h1>

        <div className="contabilidad-error">
          {error}
        </div>

        <button
          className="contabilidad-btn"
          onClick={obtenerDatos}
        >
          🔄 Intentar nuevamente
        </button>

      </div>
    );

  }


  return (

    <div className="contabilidad-container">

      {/* =================================
          CABECERA
      ================================= */}

      <div className="contabilidad-header">

        <div>

          <h1>
            📊 Contabilidad
          </h1>

          <p>
            Resumen de las ventas de tu negocio
          </p>

        </div>

        <button
          className="contabilidad-btn"
          onClick={obtenerDatos}
        >
          🔄 Actualizar
        </button>

      </div>


      {/* =================================
          TARJETAS PRINCIPALES
      ================================= */}

      <div className="contabilidad-grid">

        <div className="contabilidad-card ventas-hoy">

          <div className="card-icon">
            💰
          </div>

          <div>

            <span>
              Ventas de hoy
            </span>

            <strong>
              {dinero(datos.ventasHoy)}
            </strong>

          </div>

        </div>


        <div className="contabilidad-card ventas-mes">

          <div className="card-icon">
            📅
          </div>

          <div>

            <span>
              Ventas del mes
            </span>

            <strong>
              {dinero(datos.ventasMes)}
            </strong>

          </div>

        </div>


        <div className="contabilidad-card">

          <div className="card-icon">
            🛒
          </div>

          <div>

            <span>
              Pedidos de hoy
            </span>

            <strong>
              {datos.pedidosHoy}
            </strong>

          </div>

        </div>


        <div className="contabilidad-card">

          <div className="card-icon">
            💵
          </div>

          <div>

            <span>
              Promedio por venta
            </span>

            <strong>
              {dinero(datos.promedioVenta)}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================
          ESTADOS
      ================================= */}

      <div className="contabilidad-seccion">

        <h2>
          Estado de los pedidos
        </h2>

        <div className="estados-grid">

          <div className="estado-card pendiente">

            <span>🟡</span>

            <div>

              <small>
                Pendientes
              </small>

              <strong>
                {datos.pendientes}
              </strong>

            </div>

          </div>


          <div className="estado-card comprobante">

            <span>🧾</span>

            <div>

              <small>
                Comprobantes enviados
              </small>

              <strong>
                {datos.comprobantes}
              </strong>

            </div>

          </div>


          <div className="estado-card entregado">

            <span>🟢</span>

            <div>

              <small>
                Entregados
              </small>

              <strong>
                {datos.entregados}
              </strong>

            </div>

          </div>


          <div className="estado-card cancelado">

            <span>🔴</span>

            <div>

              <small>
                Cancelados
              </small>

              <strong>
                {datos.cancelados}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =================================
          VENTAS ÚLTIMOS 7 DÍAS
      ================================= */}

      <div className="contabilidad-seccion">

        <div className="seccion-titulo">

          <div>

            <h2>
              Ventas de los últimos 7 días
            </h2>

            <p>
              Solo se contabilizan ventas confirmadas
              o completadas.
            </p>

          </div>

        </div>


        <div className="ventas-chart">

          {datos.ventasDiarias.length === 0 ? (

            <div className="sin-ventas">
              No hay ventas registradas.
            </div>

          ) : (

            datos.ventasDiarias.map(
              (dia, index) => {

                const maximo = Math.max(
                  ...datos.ventasDiarias.map(
                    item => Number(item.total)
                  ),
                  1
                );

                const altura =
                  (Number(dia.total) / maximo) * 100;

                return (

                  <div
                    className="barra-contenedor"
                    key={index}
                  >

                    <span className="barra-monto">
                      {dinero(dia.total)}
                    </span>

                    <div className="barra-area">

                      <div
                        className="barra"
                        style={{
                          height: `${Math.max(
                            altura,
                            5
                          )}%`
                        }}
                      />

                    </div>

                    <span className="barra-dia">
                      {nombreDia(dia.fecha)}
                    </span>

                  </div>

                );

              }
            )

          )}

        </div>

      </div>


      {/* =================================
          ÚLTIMOS PEDIDOS
      ================================= */}

      <div className="contabilidad-seccion">

        <div className="seccion-titulo">

          <div>

            <h2>
              Últimos pedidos
            </h2>

            <p>
              Actividad reciente de tu negocio.
            </p>

          </div>

        </div>


        <div className="tabla-container">

          {datos.ultimosPedidos.length === 0 ? (

            <div className="sin-ventas">
              Todavía no hay pedidos.
            </div>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    Pedido
                  </th>

                  <th>
                    Cliente
                  </th>

                  <th>
                    Fecha
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                {datos.ultimosPedidos.map(
                  (pedido) => (

                    <tr
                      key={pedido.id_pedido}
                    >

                      <td>
                        #{pedido.id_pedido}
                      </td>

                      <td>
                        {pedido.cliente_nombre}
                      </td>

                      <td>
                        {fecha(
                          pedido.fecha_pedido
                        )}
                      </td>

                      <td>

                        <span
                          className={`estado-tabla estado-${pedido.estado
                            ?.toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {pedido.estado}
                        </span>

                      </td>

                      <td className="total-tabla">

                        {dinero(
                          pedido.total
                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>


    </div>

  );

};

export default Contabilidad;