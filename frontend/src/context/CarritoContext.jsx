import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();


export const CarritoProvider = ({ children }) => {


  const [carrito, setCarrito] = useState(() => {

    const guardado = localStorage.getItem("carrito");

    return guardado
      ? JSON.parse(guardado)
      : [];

  });



  const actualizarCarrito = (nuevoCarrito) => {

    setCarrito(nuevoCarrito);

    localStorage.setItem(
      "carrito",
      JSON.stringify(nuevoCarrito)
    );

  };




  // =====================================
  // AGREGAR PRODUCTO
  // =====================================

  const agregarAlCarrito = (producto) => {


    const carritoActual = [...carrito];


    const existe = carritoActual.findIndex(
      (item) =>
        Number(item.id_producto) === Number(producto.id_producto)
        &&
        item.presentacion === producto.presentacion
    );



    if(existe !== -1){


      const cantidadNueva =
        Number(carritoActual[existe].cantidad) + 1;



      if(
        cantidadNueva >
        Number(carritoActual[existe].stock)
      ){

        alert(
          `❌ Se quedó sin stock disponible.\nStock máximo: ${carritoActual[existe].stock}`
        );

        return;

      }



      carritoActual[existe] = {

        ...carritoActual[existe],

        cantidad:cantidadNueva

      };



    }else{


      if(Number(producto.stock) <= 0){


        alert(
          "❌ Producto sin stock disponible"
        );


        return;

      }



      carritoActual.push({

        ...producto,

        cantidad:1

      });


    }



    actualizarCarrito(carritoActual);


  };





  // =====================================
  // SUMAR CANTIDAD DESDE CARRITO
  // =====================================


  const aumentarCantidad = (
    id_producto,
    presentacion
  ) => {



    const carritoActual = carrito.map(
      (item)=>{


        if(
          Number(item.id_producto)
          ===
          Number(id_producto)
          &&
          item.presentacion === presentacion
        ){



          const cantidadNueva =
            Number(item.cantidad) + 1;



          const stockDisponible =
            Number(item.stock);



          if(
            cantidadNueva > stockDisponible
          ){


            alert(
              `❌ No puede agregar más unidades.\n\nStock disponible: ${stockDisponible}\nCantidad actual: ${item.cantidad}`
            );


            return item;


          }




          return {

            ...item,

            cantidad:cantidadNueva

          };


        }



        return item;


      }
    );



    actualizarCarrito(carritoActual);


  };







  // =====================================
  // RESTAR CANTIDAD
  // =====================================


  const disminuirCantidad = (
    id_producto,
    presentacion
  ) => {



    const carritoActual = carrito.map(
      (item)=>{


        if(
          Number(item.id_producto)
          ===
          Number(id_producto)
          &&
          item.presentacion === presentacion
        ){


          return {

            ...item,

            cantidad:
              Number(item.cantidad)-1

          };


        }



        return item;


      }
    )
    .filter(
      item =>
      Number(item.cantidad) > 0
    );



    actualizarCarrito(carritoActual);


  };







  // =====================================
  // ELIMINAR
  // =====================================


  const eliminarDelCarrito = (
    id_producto,
    presentacion
  )=>{


    const carritoActual =
      carrito.filter(
        item =>
        !(
          Number(item.id_producto)
          ===
          Number(id_producto)
          &&
          item.presentacion === presentacion
        )
      );



    actualizarCarrito(carritoActual);


  };







  const vaciarCarrito = ()=>{

    actualizarCarrito([]);

  };







  // =====================================
  // TOTAL
  // =====================================


  const total = carrito.reduce(

    (acum,item)=>

      acum +
      Number(item.precio)
      *
      Number(item.cantidad),

    0

  );






  const cantidadTotal = carrito.reduce(

    (acum,item)=>

      acum +
      Number(item.cantidad),

    0

  );







  return (

    <CarritoContext.Provider

      value={{

        carrito,

        agregarAlCarrito,

        aumentarCantidad,

        disminuirCantidad,

        eliminarDelCarrito,

        vaciarCarrito,

        total,

        cantidadTotal

      }}

    >

      {children}

    </CarritoContext.Provider>

  );


};





export const useCarrito = ()=>{

  return useContext(CarritoContext);

};