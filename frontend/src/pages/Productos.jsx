
import { useEffect, useState } from "react";
import api from "../api/api";
import "./Productos.css";
import { useCarrito } from "../context/CarritoContext";


function Productos() {


  const [productos, setProductos] = useState([]);

  const { agregarAlCarrito } = useCarrito();



  useEffect(() => {


    const obtenerProductos = async () => {


      try {


        const response = await api.get("/productos");


        setProductos(response.data);



      } catch (error) {


        console.error(error);


      }


    };


    obtenerProductos();


  }, []);





  // =========================
  // AGREGAR 500 GR
  // =========================


  const agregar500gr = (producto) => {


    const productoCarrito = {


      ...producto,


      // Precio de 500 gramos
      precio: Number(producto.precio_500gr),


      // Presentación
      presentacion: "500 gr",


      // Stock correcto
      stock: Number(producto.stock_500gr),


      precio_500gr: Number(producto.precio_500gr)


    };



    agregarAlCarrito(productoCarrito);


  };







  // =========================
  // AGREGAR 1 KG
  // =========================


  const agregar1Kg = (producto) => {


    const productoCarrito = {


      ...producto,


      // Precio 1 kilo
      precio: Number(producto.precio),


      // Presentación
      presentacion: "1 kg",


      // Stock correcto
      stock: Number(producto.stock_1kg)


    };



    agregarAlCarrito(productoCarrito);


  };







  return (


    <section className="productos-container">



      <h1 className="productos-titulo">

        Nuestros Productos

      </h1>





      <div className="productos-grid">


        {productos.map((producto)=>(



          <div

            className="producto-card"

            key={producto.id_producto}

          >





            <span className="producto-badge">

              🍓 Fresco

            </span>






            <img


              src={

                producto.imagen

                ?

                `http://localhost:3000${producto.imagen}`

                :

                "https://via.placeholder.com/600x400"

              }


              alt={producto.nombre}


              className="producto-imagen"


            />







            <div className="producto-info">





              <h2 className="producto-nombre">

                {producto.nombre}

              </h2>






              <p className="producto-descripcion">

                {producto.descripcion}

              </p>







              <div className="precios-producto">







                {/* =========================
                    500 GR
                ========================= */}



                <div className="precio-presentacion">



                  <span className="precio-cantidad">

                    500 gr

                  </span>





                  <span className="producto-precio">

                    $

                    {Number(
                      producto.precio_500gr
                    ).toLocaleString("es-AR")}


                  </span>







                  <button


                    className="producto-boton"


                    onClick={() =>

                      agregar500gr(producto)

                    }


                  >


                    🛒 Comprar 500 gr



                  </button>



                </div>









                {/* =========================
                    1 KG
                ========================= */}



                <div className="precio-presentacion">





                  <span className="precio-cantidad">

                    1 kg

                  </span>






                  <span className="producto-precio">

                    $

                    {Number(
                      producto.precio
                    ).toLocaleString("es-AR")}



                  </span>







                  <button


                    className="producto-boton"


                    onClick={() =>

                      agregar1Kg(producto)

                    }



                  >


                    🛒 Comprar 1 kg



                  </button>



                </div>





              </div>






            </div>






          </div>



        ))}



      </div>





    </section>


  );


}



export default Productos;
