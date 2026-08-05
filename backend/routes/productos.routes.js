const express = require("express");
const router = express.Router();

const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  editarProducto,
  eliminarProducto
} = require("../controlers/productos.controller");

const upload = require("../config/multer");

const pool = require("../config/bd");


// =====================================
// OBTENER CATEGORÍAS
// =====================================

router.get("/categorias", async (req, res) => {

  try {

    const [rows] = await pool.query(
      "SELECT * FROM categorias"
    );

    res.json(rows);

  } catch (error) {

    console.error(
      "ERROR CATEGORIAS:",
      error
    );

    res.status(500).json({
      error: "Error al obtener categorías"
    });

  }

});



// =====================================
// OBTENER TODOS LOS PRODUCTOS
// =====================================

router.get(
  "/",
  obtenerProductos
);



// =====================================
// OBTENER PRODUCTO POR ID
// =====================================

router.get(
  "/:id",
  obtenerProductoPorId
);



// =====================================
// CREAR PRODUCTO CON IMAGEN
// =====================================

router.post(
  "/",
  upload.single("imagen"),
  crearProducto
);



// =====================================
// EDITAR PRODUCTO CON IMAGEN
// =====================================

router.put(
  "/:id",
  upload.single("imagen"),
  editarProducto
);



// =====================================
// ELIMINAR PRODUCTO
// =====================================

router.delete(
  "/:id",
  eliminarProducto
);



module.exports = router;