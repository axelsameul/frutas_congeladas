import React, { useEffect, useState } from "react";
import "./opiniones.css";

const Opiniones = () => {

  const [opiniones, setOpiniones] = useState([]);

  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [estrellas, setEstrellas] = useState(5);

  const [cargando, setCargando] = useState(false);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);


  const URL = "http://localhost:3000/api/opiniones";


  // =========================
  // OBTENER OPINIONES
  // =========================

  const obtenerOpiniones = async () => {

    try {

      const res = await fetch(URL);

      const data = await res.json();

      setOpiniones(data);


    } catch (error) {

      console.error(
        "Error al obtener opiniones:",
        error
      );

    }

  };


  useEffect(() => {

    obtenerOpiniones();

  }, []);



  // =========================
  // ENVIAR OPINION
  // =========================

  const enviarOpinion = async (e) => {

    e.preventDefault();


    if (!nombre.trim() || !comentario.trim()) {

      alert("Complete todos los campos.");

      return;

    }


    setCargando(true);


    try {


      const res = await fetch(URL, {

        method:"POST",

        headers:{
          "Content-Type":"application/json",
        },


        body:JSON.stringify({

          nombre,
          comentario,
          estrellas

        }),

      });



      if(res.ok){


        setNombre("");

        setComentario("");

        setEstrellas(5);


        setMostrarFormulario(false);


        obtenerOpiniones();


      }else{


        alert(
          "No se pudo guardar la opinión."
        );


      }



    }catch(error){


      console.error(error);

      alert(
        "Error del servidor."
      );


    }



    setCargando(false);


  };



  return (

    <section className="opiniones-container">


      <div className="container">


        <h2 className="opiniones-titulo">

          ⭐ Opiniones de nuestros clientes

        </h2>



        {/* =========================
            LISTADO OPINIONES
        ========================= */}


        <div className="row">


        {
        opiniones.length === 0 ? (


          <div className="col-12">

            <h5 className="text-center text-secondary">

              Todavía no hay opiniones.

            </h5>

          </div>



        ) : (


          opiniones.map((opinion)=>(


            <div
              className="col-lg-4 col-md-6 mb-4"
              key={opinion.id_opinion}
            >


              <div className="card-opinion">


                <div className="avatar">

                  {
                  opinion.nombre
                  .charAt(0)
                  .toUpperCase()
                  }

                </div>



                <div className="nombre-cliente">

                  {opinion.nombre}

                </div>



                <div className="estrellas">

                  {
                  "⭐".repeat(
                    opinion.estrellas
                  )
                  }

                </div>



                <p className="comentario">

                  "{opinion.comentario}"

                </p>



                <div className="fecha">

                {
                opinion.fecha
                ?
                new Date(
                  opinion.fecha
                )
                .toLocaleDateString("es-AR")
                :
                ""
                }

                </div>



              </div>


            </div>


          ))


        )

        }


        </div>





        {/* =========================
            BOTON AGREGAR OPINION
        ========================= */}



        <div className="text-center mt-4">


          <button

            className="btn-agregar-opinion"

            onClick={() =>
              setMostrarFormulario(
                !mostrarFormulario
              )
            }

          >

            ✍️ Dejar una opinión


          </button>


        </div>





        {/* =========================
            FORMULARIO
        ========================= */}



        {
        mostrarFormulario && (


        <div className="form-opinion">


          <form onSubmit={enviarOpinion}>


            <div className="mb-3">


              <label className="form-label">

                Nombre

              </label>



              <input

                type="text"

                className="form-control"

                placeholder="Ingrese su nombre"

                value={nombre}

                onChange={
                  (e)=>
                  setNombre(
                    e.target.value
                  )
                }

              />


            </div>




            <div className="mb-3">


              <label className="form-label">

                Comentario

              </label>



              <textarea

                className="form-control"

                rows="4"

                placeholder="Escriba su opinión..."

                value={comentario}

                onChange={
                  (e)=>
                  setComentario(
                    e.target.value
                  )
                }

              />


            </div>





            <div className="mb-4">


              <label className="form-label">

                Calificación

              </label>




              <select

                className="form-select"

                value={estrellas}

                onChange={
                  (e)=>
                  setEstrellas(
                    Number(
                      e.target.value
                    )
                  )
                }

              >


                <option value={5}>
                  ⭐⭐⭐⭐⭐ (5)
                </option>


                <option value={4}>
                  ⭐⭐⭐⭐ (4)
                </option>


                <option value={3}>
                  ⭐⭐⭐ (3)
                </option>


                <option value={2}>
                  ⭐⭐ (2)
                </option>


                <option value={1}>
                  ⭐ (1)
                </option>



              </select>


            </div>





            <button

              type="submit"

              className="btn btn-success btn-enviar"

              disabled={cargando}

            >

              {
              cargando
              ?
              "Enviando..."
              :
              "Enviar opinión"
              }


            </button>




          </form>



        </div>


        )

        }


      </div>


    </section>


  );


};


export default Opiniones;