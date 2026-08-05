import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./Carrito.css";

const Carrito = () => {

  const navigate = useNavigate();

  const {
    carrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    total
  } = useCarrito();


  const irAlCheckout = () => {

    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    navigate("/checkout");
  };


  return (
    <div className="carrito-container">


      <h1 className="carrito-titulo">
        Mi Carrito
      </h1>



      {carrito.length === 0 ? (

        <div className="carrito-vacio">

          <div className="carrito-vacio-icono">
            🛒
          </div>

          <h2>
            No hay productos en el carrito
          </h2>

          <p>
            Agregá productos para realizar tu compra.
          </p>

          <button
            className="carrito-btn-productos"
            onClick={() => navigate("/productos")}
          >
            Ver productos
          </button>

        </div>


      ) : (

        <>


          <div className="carrito-lista">

            {carrito.map((producto) => {


              // CORRECCIÓN DEL PRECIO
              const precio = Number(
                String(producto.precio).replace(/\./g, "")
              );


              const cantidad = Number(producto.cantidad);


              const subtotal = precio * cantidad;



              return (

                <div
                  className="carrito-card"
                  key={`${producto.id_producto}-${producto.presentacion}`}
                >


                  <div className="carrito-info">


                    <h3 className="carrito-producto-nombre">
                      {producto.nombre}
                    </h3>



                    <p className="carrito-presentacion">
                      Presentación: {producto.presentacion}
                    </p>



                    <p className="carrito-precio">
                      ${precio.toLocaleString("es-AR")} c/u
                    </p>



                    <div className="carrito-controles">


                      <button
                        className="carrito-btn-cantidad"
                        onClick={() =>
                          disminuirCantidad(
                            producto.id_producto,
                            producto.presentacion
                          )
                        }
                      >
                        −
                      </button>



                      <span className="carrito-cantidad">
                        {cantidad}
                      </span>



                      <button
                        className="carrito-btn-cantidad"
                        onClick={() =>
                          aumentarCantidad(
                            producto.id_producto,
                            producto.presentacion
                          )
                        }
                      >
                        +
                      </button>


                    </div>


                  </div>





                  <div className="carrito-producto-derecha">


                    <strong className="carrito-subtotal">
                      ${subtotal.toLocaleString("es-AR")}
                    </strong>



                    <button
                      className="carrito-btn-eliminar"
                      onClick={() =>
                        eliminarDelCarrito(
                          producto.id_producto,
                          producto.presentacion
                        )
                      }
                    >
                      🗑️ Eliminar
                    </button>


                  </div>



                </div>

              );


            })}


          </div>





          <div className="carrito-resumen">


            <div className="carrito-total-contenedor">

              <span>
                Total de la compra
              </span>


              <h2 className="carrito-total">
                ${
                  Number(
                    String(total).replace(/\./g, "")
                  ).toLocaleString("es-AR")
                }
              </h2>


            </div>





            <button
              className="carrito-btn-comprar"
              onClick={irAlCheckout}
            >
              Finalizar Compra →
            </button>



          </div>


        </>

      )}


    </div>
  );
};


export default Carrito;