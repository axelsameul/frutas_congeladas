const pool = require("../config/bd");
const fs = require("fs");
const path = require("path");


// =====================================================
// OBTENER TODOS LOS PRODUCTOS
// =====================================================

const obtenerProductos = async (req, res) => {

  try {

    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE activo = 1"
    );

    res.json(rows);

  } catch (error) {

    console.error("ERROR OBTENER PRODUCTOS:", error);

    res.status(500).json({
      error: "Error al obtener productos"
    });

  }

};



// =====================================================
// OBTENER PRODUCTO POR ID
// =====================================================

const obtenerProductoPorId = async (req, res) => {

  const { id } = req.params;

  try {

    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );


    if (rows.length === 0) {

      return res.status(404).json({
        error: "Producto no encontrado"
      });

    }


    res.json(rows[0]);


  } catch (error) {

    console.error("ERROR OBTENER PRODUCTO:", error);

    res.status(500).json({
      error: "Error al obtener producto"
    });

  }

};



// =====================================================
// CREAR PRODUCTO
// =====================================================

const crearProducto = async (req, res) => {


  const {

    nombre,
    descripcion,
    precio,
    precio_500gr,
    stock_1kg,
    stock_500gr,
    id_categoria

  } = req.body;



  try {


    console.log("ARCHIVO RECIBIDO:", req.file);
    console.log("DATOS RECIBIDOS:", req.body);



    const imagen = req.file

      ? `/uploads/productos/${req.file.filename}`

      : null;



    const [result] = await pool.query(

`
INSERT INTO productos
(
 nombre,
 descripcion,
 precio,
 precio_500gr,
 stock_1kg,
 stock_500gr,
 id_categoria,
 imagen
)

VALUES (?,?,?,?,?,?,?,?)
`,

[
 nombre,
 descripcion,
 precio,
 precio_500gr,
 stock_1kg,
 stock_500gr,
 id_categoria,
 imagen
]

);



    res.json({

      message:"Producto creado correctamente",

      id: result.insertId,

      imagen

    });



  } catch(error) {


    console.error("ERROR CREAR PRODUCTO:", error);


    res.status(500).json({

      error:"Error al crear producto"

    });


  }


};



// =====================================================
// EDITAR PRODUCTO
// =====================================================

const editarProducto = async (req,res)=>{


  const { id } = req.params;


  const {

    nombre,
    descripcion,
    precio,
    precio_500gr,
    stock_1kg,
    stock_500gr,
    id_categoria

  } = req.body;



  try {


    console.log("ARCHIVO EDITAR:", req.file);
    console.log("DATOS EDITAR:", req.body);



    const [producto] = await pool.query(

      "SELECT * FROM productos WHERE id_producto = ?",

      [id]

    );



    if(producto.length === 0){


      return res.status(404).json({

        error:"Producto no encontrado"

      });


    }



    // mantiene la imagen anterior

    let imagen = producto[0].imagen;



    // si llega una nueva imagen

    if(req.file){



      if(imagen){


        const rutaAnterior = path.join(

          __dirname,

          "..",

          imagen

        );



        if(fs.existsSync(rutaAnterior)){

          fs.unlinkSync(rutaAnterior);

        }


      }



      imagen = `/uploads/productos/${req.file.filename}`;


    }





    await pool.query(

`
UPDATE productos

SET

nombre = ?,
descripcion = ?,
precio = ?,
precio_500gr = ?,
stock_1kg = ?,
stock_500gr = ?,
id_categoria = ?,
imagen = ?

WHERE id_producto = ?

`,

[

nombre,
descripcion,
precio,
precio_500gr,
stock_1kg,
stock_500gr,
id_categoria,
imagen,
id

]

);





    res.json({

      message:"Producto actualizado correctamente"

    });



  } catch(error){


    console.error("ERROR EDITAR PRODUCTO:",error);


    res.status(500).json({

      error:"Error al editar producto"

    });


  }


};



// =====================================================
// ELIMINAR PRODUCTO
// =====================================================
const eliminarProducto = async (req, res) => {

  const { id } = req.params;

  try {

    // Buscar producto
    const [producto] = await pool.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );


    if (producto.length === 0) {

      return res.status(404).json({
        error: "Producto no encontrado"
      });

    }


    // Eliminar imagen del servidor
    if (producto[0].imagen) {

      const rutaImagen = path.join(
        __dirname,
        "..",
        producto[0].imagen
      );


      if (fs.existsSync(rutaImagen)) {

        fs.unlinkSync(rutaImagen);

      }

    }



    // Eliminar detalles de pedidos cancelados
    await pool.query(
      `
      DELETE dp 
      FROM detalle_pedido dp
      INNER JOIN pedidos p 
      ON dp.id_pedido = p.id_pedido
      WHERE dp.id_producto = ?
      AND p.estado = 'Cancelado'
      `,
      [id]
    );



    // Ahora intentar eliminar producto
    await pool.query(
      "DELETE FROM productos WHERE id_producto = ?",
      [id]
    );



    res.json({

      message: "Producto eliminado correctamente"

    });



  } catch (error) {


    console.error("ERROR ELIMINAR PRODUCTO:", error);


    res.status(500).json({

      error: "No se puede eliminar el producto porque tiene pedidos activos"

    });


  }

};



// =====================================================
// EXPORTAR
// =====================================================

module.exports = {

  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  editarProducto,
  eliminarProducto

};