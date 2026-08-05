import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

const API_URL = "https://backend-frutas.onrender.com";

const Admin = () => {

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [editando, setEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_500gr: "",
    stock_1kg: "",
    stock_500gr: "",
    id_categoria: "",
    imagen: null
  });

  const [preview, setPreview] = useState(null);


  // =========================
  // OBTENER PRODUCTOS
  // =========================

  const obtenerProductos = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/productos`
      );

      setProductos(response.data);

    } catch (error) {

      console.error(
        "Error al obtener productos:",
        error
      );

    }

  };


  // =========================
  // OBTENER CATEGORÍAS
  // =========================

  const obtenerCategorias = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/productos/categorias`
      );

      setCategorias(response.data);

    } catch (error) {

      console.error(
        "Error al obtener categorías:",
        error
      );

    }

  };


  useEffect(() => {

    obtenerProductos();
    obtenerCategorias();

  }, []);



  // =========================
  // CAMBIAR INPUT
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormulario({

      ...formulario,

      [name]: value

    });

  };



  // =========================
  // CAMBIAR IMAGEN
  // =========================

  const handleImagen = (e) => {

    const archivo = e.target.files[0];


    if (!archivo) return;


    setFormulario({

      ...formulario,

      imagen: archivo

    });


    setPreview(
      URL.createObjectURL(archivo)
    );

  };



  // =========================
  // GUARDAR PRODUCTO
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {


      const datos = new FormData();


      datos.append(
        "nombre",
        formulario.nombre
      );


      datos.append(
        "descripcion",
        formulario.descripcion
      );


      datos.append(
        "precio",
        formulario.precio
      );


      datos.append(
        "precio_500gr",
        formulario.precio_500gr
      );


      // STOCK NUEVO

      datos.append(
        "stock_1kg",
        formulario.stock_1kg
      );


      datos.append(
        "stock_500gr",
        formulario.stock_500gr
      );


      datos.append(
        "id_categoria",
        formulario.id_categoria
      );



      if (formulario.imagen) {

        datos.append(
          "imagen",
          formulario.imagen
        );

      }



      if (editando) {


        await axios.put(

          `${API_URL}/api/productos/${editando}`,

          datos

        );


        alert(
          "Producto actualizado correctamente"
        );


      } else {


        await axios.post(

          `${API_URL}/api/productos`,

          datos

        );


        alert(
          "Producto creado correctamente"
        );


      }



      limpiarFormulario();

      obtenerProductos();



    } catch (error) {


      console.error(error);


      alert(

        error.response?.data?.error ||

        "Ocurrió un error"

      );


    }

  };



  // =========================
  // EDITAR PRODUCTO
  // =========================

  const editarProducto = (producto) => {


    setEditando(
      producto.id_producto
    );


    setFormulario({

      nombre: producto.nombre || "",

      descripcion: producto.descripcion || "",

      precio: producto.precio || "",

      precio_500gr:
        producto.precio_500gr || "",

      stock_1kg:
        producto.stock_1kg || "",

      stock_500gr:
        producto.stock_500gr || "",

      id_categoria:
        producto.id_categoria || "",

      imagen: null

    });



    if (producto.imagen) {


      setPreview(
        `${API_URL}${producto.imagen}`
      );


    } else {


      setPreview(null);


    }



    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });


  };// =========================
// ELIMINAR PRODUCTO
// =========================

const eliminarProducto = async (id) => {

  const confirmar = window.confirm(
    "¿Seguro que querés eliminar este producto?"
  );


  if (!confirmar) return;


  try {


    await axios.delete(
      `${API_URL}/api/productos/${id}`
    );


    alert(
      "Producto eliminado"
    );


    obtenerProductos();


  } catch (error) {


    console.error(error);


    alert(
      "No se pudo eliminar el producto"
    );


  }

};



// =========================
// LIMPIAR FORMULARIO
// =========================

const limpiarFormulario = () => {


  setFormulario({

    nombre: "",

    descripcion: "",

    precio: "",

    precio_500gr: "",

    stock_1kg: "",

    stock_500gr: "",

    id_categoria: "",

    imagen: null

  });


  setPreview(null);

  setEditando(null);


};




return (

<div className="admin-container">


<h1 className="admin-title">

Panel de Administración

</h1>



<div className="admin-product-form">


<h2>

{editando
? "Editar producto"
: "Agregar producto"}

</h2>



<form onSubmit={handleSubmit}>


<div className="admin-image-section">


<label>

Imagen del producto

</label>


<input

type="file"

accept="image/png,image/jpeg,image/webp"

onChange={handleImagen}

/>



{preview && (

<div className="admin-image-preview">


<img

src={preview}

alt="Vista previa"

/>


</div>

)}


</div>





<div className="admin-input">

<label>

Nombre

</label>


<input

type="text"

name="nombre"

value={formulario.nombre}

onChange={handleChange}

placeholder="Nombre del producto"

required

/>

</div>





<div className="admin-input">


<label>

Descripción

</label>


<textarea

name="descripcion"

value={formulario.descripcion}

onChange={handleChange}

placeholder="Descripción del producto"

/>


</div>





<div className="admin-precios">



<div className="admin-input">


<label>

Precio 500 gr

</label>


<input

type="number"

name="precio_500gr"

value={formulario.precio_500gr}

onChange={handleChange}

placeholder="Ej: 3500"

min="0"

step="0.01"

required

/>


</div>




<div className="admin-input">


<label>

Precio 1 kg

</label>


<input

type="number"

name="precio"

value={formulario.precio}

onChange={handleChange}

placeholder="Ej: 6500"

min="0"

step="0.01"

required

/>


</div>



</div>





{/* STOCK NUEVO */}



<div className="admin-precios">



<div className="admin-input">


<label>

Stock 1 kg

</label>


<input

type="number"

name="stock_1kg"

value={formulario.stock_1kg}

onChange={handleChange}

placeholder="Cantidad de kilos"

min="0"

required

/>


</div>




<div className="admin-input">


<label>

Stock 500 gr

</label>


<input

type="number"

name="stock_500gr"

value={formulario.stock_500gr}

onChange={handleChange}

placeholder="Cantidad de medios kilos"

min="0"

required

/>


</div>



</div>





<div className="admin-input">


<label>

Categoría

</label>


<select

name="id_categoria"

value={formulario.id_categoria}

onChange={handleChange}

required

>


<option value="">

Seleccionar categoría

</option>


{categorias.map((categoria)=>(


<option

key={categoria.id_categoria}

value={categoria.id_categoria}

>


{categoria.nombre}


</option>


))}


</select>


</div>





<div className="admin-form-buttons">


<button

type="submit"

className="btn-agregar"

>


{editando
? "Guardar cambios"
: "Agregar producto"}


</button>




{editando && (

<button

type="button"

className="btn-cancelar"

onClick={limpiarFormulario}

>

Cancelar edición

</button>

)}


</div>



</form>


</div>





<div className="admin-products">


<h2>

Productos existentes

</h2>




<div className="admin-products-grid">


{productos.map((producto)=>(


<div

className="admin-product-card"

key={producto.id_producto}

>




<div className="admin-product-image">


{producto.imagen ? (


<img

src={`${API_URL}${producto.imagen}`}

alt={producto.nombre}

/>


) : (


<div className="sin-imagen">

Sin imagen

</div>


)}


</div>





<div className="admin-product-info">


<h3>

{producto.nombre}

</h3>



<p>

{producto.descripcion}

</p>





<div className="admin-precios-card">


<div>


<span>

500 gr

</span>


<strong>

${Number(
producto.precio_500gr
).toLocaleString("es-AR")}

</strong>


</div>





<div>


<span>

1 kg

</span>


<strong>

${Number(
producto.precio
).toLocaleString("es-AR")}

</strong>


</div>


</div>





<p>

Stock 1 kg:
<strong>
{producto.stock_1kg}
</strong>

</p>


<p>

Stock 500 gr:
<strong>
{producto.stock_500gr}
</strong>

</p>



</div>





<div className="admin-product-actions">


<button

className="btn-editar"

onClick={() => editarProducto(producto)}

>

✏️ Editar

</button>




<button

className="btn-eliminar"

onClick={() =>
eliminarProducto(producto.id_producto)
}

>

🗑️ Eliminar

</button>


</div>




</div>


))}


</div>


</div>



</div>

);


};


export default Admin;