import { useEffect, useState } from "react";
import api from "../api/api";
import "./Pedidos.css";

const estados = [
  "Pendiente",
  "Comprobante Enviado",
  "Confirmado",
  "Preparando",
  "Enviado",
  "Entregado",
  "Cancelado",
];

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [fechaBusqueda, setFechaBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [pedidosPorPagina, setPedidosPorPagina] = useState(10);

  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get("/pedidos");

      const pedidosOrdenados = [...response.data].sort(
        (a, b) =>
          new Date(b.fecha_pedido) -
          new Date(a.fecha_pedido)
      );

      setPedidos(pedidosOrdenados);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);

      setError(
        error.response?.data?.error ||
        "No se pudieron cargar los pedidos."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const cambiarEstado = async (idPedido, nuevoEstado) => {
    try {
      await api.put(`/pedidos/${idPedido}/estado`, {
        estado: nuevoEstado,
      });

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((pedido) =>
          pedido.id_pedido === idPedido
            ? {
                ...pedido,
                estado: nuevoEstado,
              }
            : pedido
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);

      alert(
        error.response?.data?.error ||
        "No se pudo cambiar el estado del pedido."
      );
    }
  };
  const eliminarPedido = async (idPedido) => {

  const confirmar = window.confirm(
    "¿Seguro que querés eliminar este pedido cancelado?"
  );

  if (!confirmar) return;


  try {

    await api.delete(`/pedidos/${idPedido}`);


    setPedidos((pedidosActuales) =>
      pedidosActuales.filter(
        (pedido) =>
          pedido.id_pedido !== idPedido
      )
    );


    alert("Pedido eliminado correctamente");


  } catch (error) {

    console.error(
      "Error al eliminar pedido:",
      error
    );


    alert(
      error.response?.data?.error ||
      "No se pudo eliminar el pedido"
    );

  }

};

  /* ==========================================
     FILTRAR PEDIDOS
  ========================================== */

  const pedidosFiltrados = pedidos.filter((pedido) => {
    // Filtro por estado
    if (
      estadoFiltro &&
      pedido.estado !== estadoFiltro
    ) {
      return false;
    }

    // Filtro por fecha
    if (fechaBusqueda) {
      if (!pedido.fecha_pedido) {
        return false;
      }

      const fechaPedido = new Date(
        pedido.fecha_pedido
      );

      const año = fechaPedido.getFullYear();

      const mes = String(
        fechaPedido.getMonth() + 1
      ).padStart(2, "0");

      const dia = String(
        fechaPedido.getDate()
      ).padStart(2, "0");

      const fechaFormateada =
        `${año}-${mes}-${dia}`;

      if (fechaFormateada !== fechaBusqueda) {
        return false;
      }
    }

    return true;
  });

  /* ==========================================
     PAGINACIÓN
  ========================================== */

  const totalPaginas = Math.ceil(
    pedidosFiltrados.length / pedidosPorPagina
  );

  const indiceInicial =
    (paginaActual - 1) * pedidosPorPagina;

  const pedidosPaginados =
    pedidosFiltrados.slice(
      indiceInicial,
      indiceInicial + pedidosPorPagina
    );

  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const limpiarFiltros = () => {
    setFechaBusqueda("");
    setEstadoFiltro("");
    setPaginaActual(1);
  };

  /* ==========================================
     CARGANDO
  ========================================== */

  if (cargando) {
    return (
      <div className="pedidos-container">

        <div className="pedidos-loading">
          <div className="spinner"></div>
          <p>Cargando pedidos...</p>
        </div>

      </div>
    );
  }

  return (
    <div className="pedidos-container">

      {/* ======================================
          CABECERA
      ====================================== */}

      <div className="pedidos-header">

        <div>
          <h1>Pedidos</h1>

          <p>
            Administrá los pedidos realizados
            por los clientes.
          </p>
        </div>

        <button
          className="pedidos-actualizar"
          onClick={obtenerPedidos}
        >
          🔄 Actualizar
        </button>

      </div>

      {/* ======================================
          FILTROS
      ====================================== */}

      <div className="pedidos-filtros">

        <div className="filtro-item">

          <label>
            Fecha
          </label>

          <input
            type="date"
            value={fechaBusqueda}
            onChange={(e) => {
              setFechaBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

        </div>

        <div className="filtro-item">

          <label>
            Estado
          </label>

          <select
            value={estadoFiltro}
            onChange={(e) => {
              setEstadoFiltro(e.target.value);
              setPaginaActual(1);
            }}
          >

            <option value="">
              Todos los estados
            </option>

            {estados.map((estado) => (
              <option
                key={estado}
                value={estado}
              >
                {estado}
              </option>
            ))}

          </select>

        </div>

        <div className="filtro-item">

          <label>
            Pedidos por página
          </label>

          <select
            value={pedidosPorPagina}
            onChange={(e) => {
              setPedidosPorPagina(
                Number(e.target.value)
              );
              setPaginaActual(1);
            }}
          >
            <option value={6}>6 pedidos</option>
            <option value={10}>10 pedidos</option>
          </select>

        </div>

        {(fechaBusqueda || estadoFiltro) && (

          <button
            className="limpiar-filtros"
            onClick={limpiarFiltros}
          >
            ✕ Limpiar filtros
          </button>

        )}

      </div>

      {/* ======================================
          INFORMACIÓN
      ====================================== */}

      <div className="pedidos-resumen">

        <div>

          <strong>
            {pedidosFiltrados.length}
          </strong>

          <span>
            {pedidosFiltrados.length === 1
              ? " pedido encontrado"
              : " pedidos encontrados"}
          </span>

        </div>

        {(fechaBusqueda || estadoFiltro) && (

          <span className="filtros-activos">

            Filtros activos

          </span>

        )}

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="pedidos-error">
          {error}
        </div>
      )}

      {/* ======================================
          SIN PEDIDOS
      ====================================== */}

      {!error &&
        pedidosFiltrados.length === 0 && (

          <div className="pedidos-vacio">

            <div className="vacio-icono">
              📦
            </div>

            <h2>
              No se encontraron pedidos
            </h2>

            <p>
              No hay pedidos que coincidan
              con los filtros seleccionados.
            </p>

            {(fechaBusqueda || estadoFiltro) && (

              <button
                onClick={limpiarFiltros}
                className="boton-quitar-filtro"
              >
                Ver todos los pedidos
              </button>

            )}

          </div>

        )}

      {/* ======================================
          LISTA
      ====================================== */}

      <div className="pedidos-lista">

        {pedidosPaginados.map((pedido) => (

          <PedidoCard
  key={pedido.id_pedido}
  pedido={pedido}
  cambiarEstado={cambiarEstado}
  eliminarPedido={eliminarPedido}
/>

        ))}

      </div>

      {/* ======================================
          PAGINACIÓN
      ====================================== */}

      {totalPaginas > 1 && (

        <div className="pedidos-paginacion">

          <button
            className="paginacion-flecha"
            disabled={paginaActual === 1}
            onClick={() =>
              cambiarPagina(paginaActual - 1)
            }
          >
            ←
          </button>

          <div className="paginas">

            {Array.from(
              { length: totalPaginas },
              (_, index) => index + 1
            ).map((pagina) => (

              <button
                key={pagina}
                className={
                  paginaActual === pagina
                    ? "pagina-activa"
                    : ""
                }
                onClick={() =>
                  cambiarPagina(pagina)
                }
              >
                {pagina}
              </button>

            ))}

          </div>

          <button
            className="paginacion-flecha"
            disabled={
              paginaActual === totalPaginas
            }
            onClick={() =>
              cambiarPagina(paginaActual + 1)
            }
          >
            →
          </button>

        </div>

      )}

    </div>
  );
};


/* ==================================================
   PEDIDO CARD
================================================== */

const PedidoCard = ({
  pedido,
  cambiarEstado,
  eliminarPedido
}) => {

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] =
    useState(false);
  const [mostrarProductos, setMostrarProductos] =
    useState(false);

  const obtenerDetalle = async () => {

    try {

      setCargandoProductos(true);

      const response = await api.get(
        `/pedidos/${pedido.id_pedido}/detalle`
      );

      setProductos(response.data);

    } catch (error) {

      console.error(
        "Error al obtener productos:",
        error
      );

    } finally {

      setCargandoProductos(false);

    }
  };

  const toggleProductos = () => {

    if (!mostrarProductos && productos.length === 0) {
      obtenerDetalle();
    }

    setMostrarProductos(
      !mostrarProductos
    );
  };

  const fecha = pedido.fecha_pedido
    ? new Date(
        pedido.fecha_pedido
      ).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sin fecha";

  const claseEstado =
    pedido.estado
      ?.toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(",", "");

  return (

    <div className="pedido-card">

      {/* ======================================
          PARTE SUPERIOR
      ====================================== */}

      <div className="pedido-top">

        <div className="pedido-identificacion">

          <div className="pedido-icono">
            🧾
          </div>

          <div>

            <span className="pedido-numero">
              Pedido #{pedido.id_pedido}
            </span>

            <span className="pedido-fecha">
              {fecha}
            </span>

          </div>

        </div>

        <select
          className={`pedido-estado estado-${claseEstado}`}
          value={pedido.estado}
          onChange={(e) =>
            cambiarEstado(
              pedido.id_pedido,
              e.target.value
            )
          }
        >

          {estados.map((estado) => (

            <option
              key={estado}
              value={estado}
            >
              {estado}
            </option>

          ))}

        </select>

      </div>

      {/* ======================================
          INFORMACIÓN PRINCIPAL
      ====================================== */}

      <div className="pedido-informacion">

        <div className="pedido-info-item">

          <span className="info-label">
            👤 Cliente
          </span>

          <strong>
            {pedido.cliente_nombre || "Sin nombre"}
          </strong>

        </div>

        <div className="pedido-info-item">

          <span className="info-label">
            📞 Teléfono
          </span>

          <strong>
            {pedido.cliente_telefono || "Sin teléfono"}
          </strong>

        </div>

        <div className="pedido-info-item pedido-direccion">

          <span className="info-label">
            📍 Dirección
          </span>

          <strong>
            {pedido.cliente_direccion || "Sin dirección"}
          </strong>

        </div>

        <div className="pedido-info-item">

          <span className="info-label">
            📦 Pedido
          </span>

          <strong>
            Ver productos
          </strong>

        </div>

      </div>

      {/* ======================================
          EMAIL
      ====================================== */}

      {pedido.cliente_email && (

        <div className="pedido-email">

          ✉️ {pedido.cliente_email}

        </div>

      )}

      {/* ======================================
          BARRA INFERIOR
      ====================================== */}

      <div className="pedido-bottom">
       {pedido.estado === "Cancelado" && (

        <button
          className="pedido-eliminar"
          onClick={() =>
          eliminarPedido(pedido.id_pedido)
            }
        >
    🗑️ Eliminar pedido
  </button>

)}
        <button
          className="pedido-productos-boton"
          onClick={toggleProductos}
        >
          {mostrarProductos
            ? "▲ Ocultar productos"
            : "▼ Ver productos"}
        </button>

        <div className="pedido-total">

          <span>
            Total
          </span>

          <strong>
            $
            {Number(
              pedido.total
            ).toFixed(2)}
          </strong>

        </div>

      </div>

      {/* ======================================
          PRODUCTOS DESPLEGABLES
      ====================================== */}

      {mostrarProductos && (

        <div className="pedido-detalle">

          <div className="detalle-titulo">
            <span>📦</span>
            Productos del pedido
          </div>

          {cargandoProductos ? (

            <div className="detalle-cargando">
              Cargando productos...
            </div>

          ) : productos.length === 0 ? (

            <div className="detalle-vacio">
              No se encontraron productos.
            </div>

          ) : (

            <div className="productos-lista">

              {productos.map((producto) => (

                <div
                  className="pedido-producto"
                  key={producto.id_detalle}
                >

                  <div className="producto-nombre">

                    <strong>
                      {producto.producto_nombre}
                    </strong>

                    <span>
                      Cantidad: {producto.cantidad}
                    </span>

                  </div>

                  <div className="producto-precio">

                    <span>
                      $
                      {Number(
                        producto.precio_unitario
                      ).toFixed(2)}{" "}
                      c/u
                    </span>

                    <strong>
                      $
                      {Number(
                        producto.subtotal
                      ).toFixed(2)}
                    </strong>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

      {/* ======================================
          OBSERVACIONES
      ====================================== */}

      {pedido.observaciones && (

        <div className="pedido-observaciones">

          <strong>
            📝 Observaciones
          </strong>

          <p>
            {pedido.observaciones}
          </p>

        </div>

      )}

    </div>

  );
};

export default Pedidos;