import React, { useEffect, useState } from "react";
import axios from "axios";

import "./AdminOpiniones.css";

const API_URL = "https://backend-frutas.onrender.com";


const AdminOpiniones = () => {

  const [opiniones,setOpiniones] = useState([]);


  const obtenerOpiniones = async()=>{

    try{

      const res = await axios.get(
        `${API_URL}/api/opiniones`
      );

      setOpiniones(res.data);


    }catch(error){

      console.log(error);

    }

  };


  useEffect(()=>{

    obtenerOpiniones();

  },[]);



  const eliminarOpinion = async(id)=>{


    const confirmar = window.confirm(
      "¿Eliminar esta opinión?"
    );


    if(!confirmar) return;


    try{

      await axios.delete(
        `${API_URL}/api/opiniones/${id}`
      );


      alert("Opinión eliminada");

      obtenerOpiniones();


    }catch(error){

      console.log(error);

      alert("No se pudo eliminar");

    }

  };



  return (

    <div className="admin-opiniones">

      <h1>
        Opiniones de clientes
      </h1>


      <div className="opiniones-admin-grid">


      {opiniones.map((opinion)=>(


        <div 
          className="opinion-admin-card"
          key={opinion.id_opinion}
        >


          <h3>
            {opinion.nombre}
          </h3>


          <div className="estrellas">
            {"⭐".repeat(opinion.estrellas)}
          </div>


          <p>
            {opinion.comentario}
          </p>


          <small>
            {new Date(opinion.fecha)
            .toLocaleDateString("es-AR")}
          </small>


          <button
            onClick={()=>eliminarOpinion(
              opinion.id_opinion
            )}
          >
            🗑️ Eliminar
          </button>


        </div>


      ))}


      </div>


    </div>

  );

};


export default AdminOpiniones;