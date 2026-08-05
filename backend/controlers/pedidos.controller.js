const pool = require("../config/bd");

// =====================================================
// CREAR PEDIDO
// =====================================================
const crearPedido = async (req, res) => {

  const connection = await pool.getConnection();

  try {

    const {
      cliente,
      productos,
      total,
      observaciones,
      formaPago
    } = req.body;


    console.log("=================================");
    console.log("📦 DATOS COMPLETOS RECIBIDOS:");
    console.log(JSON.stringify(req.body, null, 2));
    console.log("=================================");


    console.log("🛒 PRODUCTOS RECIBIDOS:");
    console.log(productos);


    if (!cliente) {
      return res.status(400).json({
        error: "No se recibieron los datos del cliente"
      });
    }


    if (!productos || productos.length === 0) {
      return res.status(400).json({
        error: "El carrito está vacío"
      });
    }



    await connection.beginTransaction();



    const [clienteResult] = await connection.query(
      `
      INSERT INTO clientes
      (nombre, telefono, email, direccion)
      VALUES (?, ?, ?, ?)
      `,
      [
        cliente.nombre.trim(),
        cliente.telefono.trim(),
        cliente.email || null,
        cliente.direccion.trim()
      ]
    );



    const id_cliente = clienteResult.insertId;



    let observacionesFinales = observaciones || "";


    if(formaPago){

      observacionesFinales +=
      ` Forma de pago: ${formaPago}.`;

    }





    const [pedidoResult] = await connection.query(
      `
      INSERT INTO pedidos
      (
        id_cliente,
        total,
        estado,
        observaciones
      )
      VALUES (?, ?, 'Pendiente', ?)
      `,
      [
        id_cliente,
        Number(total),
        observacionesFinales.trim()
      ]
    );



    const id_pedido = pedidoResult.insertId;



    console.log("🧾 ID PEDIDO CREADO:");
    console.log(id_pedido);





    for(const producto of productos){


      console.log("=================================");
      console.log("➡️ GUARDANDO PRODUCTO:");
      console.log({
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        cantidad: producto.cantidad,
        precio: producto.precio,
        presentacion: producto.presentacion
      });
      console.log("=================================");



      await connection.query(
        `
        INSERT INTO detalle_pedido
        (
          id_pedido,
          id_producto,
          cantidad,
          precio_unitario,
          subtotal,
          presentacion
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          id_pedido,
          producto.id_producto,
          Number(producto.cantidad),
          Number(producto.precio),
          Number(producto.precio) * Number(producto.cantidad),
          producto.presentacion
        ]
      );


    }



    await connection.commit();



    console.log("✅ PEDIDO GUARDADO CORRECTAMENTE");



    res.status(201).json({

      message:"Pedido creado exitosamente",
      id_pedido

    });



  } catch(error){


    await connection.rollback();


    console.error(
      "❌ ERROR CREAR PEDIDO:",
      error
    );


    res.status(500).json({

      error:error.message

    });



  } finally{


    connection.release();


  }

};


// =====================================================
// OBTENER PEDIDOS
// =====================================================

const obtenerPedidos = async (req, res) => {

  try {

    const [pedidos] = await pool.query(`
      SELECT
        p.id_pedido,
        p.id_cliente,
        p.total,
        p.estado,
        p.observaciones,
        p.fecha_pedido,

        c.nombre AS cliente_nombre,
        c.telefono AS cliente_telefono,
        c.email AS cliente_email,
        c.direccion AS cliente_direccion

      FROM pedidos p

      INNER JOIN clientes c
        ON p.id_cliente = c.id_cliente

      ORDER BY p.fecha_pedido DESC
    `);

    res.json(pedidos);

  } catch (error) {

    console.error(
      "ERROR AL OBTENER PEDIDOS:",
      error
    );

    res.status(500).json({
      error: "Error al obtener pedidos"
    });

  }
};


// =====================================================
// DETALLE DEL PEDIDO
// =====================================================

const obtenerDetallePedido = async (req, res) => {

  const { id } = req.params;

  try {

    const [detalles] = await pool.query(
      `
      SELECT
        dp.id_detalle,
        dp.id_pedido,
        dp.id_producto,
        dp.cantidad,
        dp.precio_unitario,
        dp.subtotal,

        pr.nombre AS producto_nombre

      FROM detalle_pedido dp

      INNER JOIN productos pr
        ON dp.id_producto = pr.id_producto

      WHERE dp.id_pedido = ?

      ORDER BY dp.id_detalle ASC
      `,
      [id]
    );

    res.json(detalles);

  } catch (error) {

    console.error(
      "ERROR AL OBTENER DETALLE:",
      error
    );

    res.status(500).json({
      error: "Error al obtener detalle"
    });

  }
};


// =====================================================
// CAMBIAR ESTADO
// =====================================================

// =====================================================
// CAMBIAR ESTADO + DESCONTAR STOCK AL CONFIRMAR
// =====================================================

const cambiarEstadoPedido = async (req,res)=>{


const {id}=req.params;

const {estado}=req.body;



const connection = await pool.getConnection();



try{


await connection.beginTransaction();




const [pedidoActual]=await connection.query(

`
SELECT estado, stock_descontado
FROM pedidos
WHERE id_pedido=?
`,

[id]

);




if(pedidoActual.length===0){

throw new Error(
"Pedido no encontrado"
);

}





if(
estado==="Confirmado" &&
pedidoActual[0].stock_descontado===0
){



const [productos]=await connection.query(

`
SELECT
id_producto,
cantidad,
presentacion
FROM detalle_pedido
WHERE id_pedido=?
`,

[id]

);





for(const producto of productos){



let campoStock;



if(producto.presentacion==="1 kg"){


campoStock="stock_1kg";


}
else if(producto.presentacion==="500 gr"){


campoStock="stock_500gr";


}
else{


throw new Error(
"El pedido no tiene presentación asignada"
);


}






const [stock]=await connection.query(

`
SELECT ${campoStock}
FROM productos
WHERE id_producto=?
`,

[
producto.id_producto
]

);






if(
Number(stock[0][campoStock])
<
Number(producto.cantidad)
){


throw new Error(

`No hay stock suficiente de ${producto.presentacion}`

);


}







await connection.query(

`
UPDATE productos
SET ${campoStock}=${campoStock}-?
WHERE id_producto=?
`,

[
producto.cantidad,
producto.id_producto
]

);



}





await connection.query(

`
UPDATE pedidos
SET stock_descontado=1
WHERE id_pedido=?
`,

[id]

);



}





await connection.query(

`
UPDATE pedidos
SET estado=?
WHERE id_pedido=?
`,

[
estado,
id
]

);





await connection.commit();



res.json({

message:"Estado actualizado correctamente"

});





}catch(error){



await connection.rollback();


console.error(
"ERROR CAMBIAR ESTADO:",
error
);



res.status(500).json({

error:error.message

});



}finally{


connection.release();


}



};
// =====================================================
// CONTABILIDAD - RESUMEN
// =====================================================

const obtenerContabilidad = async (req, res) => {

  try {

    // -----------------------------------------
    // VENTAS REALES
    // -----------------------------------------

    const estadosVenta = [
      "Confirmado",
      "Preparando",
      "Enviado",
      "Entregado"
    ];

    const placeholders = estadosVenta
      .map(() => "?")
      .join(",");


    // -----------------------------------------
    // VENTAS DE HOY
    // -----------------------------------------

    const [ventasHoy] = await pool.query(
      `
      SELECT
        COALESCE(SUM(total), 0) AS total
      FROM pedidos
      WHERE DATE(fecha_pedido) = CURDATE()
      AND estado IN (${placeholders})
      `,
      estadosVenta
    );


    // -----------------------------------------
    // VENTAS DEL MES
    // -----------------------------------------

    const [ventasMes] = await pool.query(
      `
      SELECT
        COALESCE(SUM(total), 0) AS total
      FROM pedidos
      WHERE YEAR(fecha_pedido) = YEAR(CURDATE())
      AND MONTH(fecha_pedido) = MONTH(CURDATE())
      AND estado IN (${placeholders})
      `,
      estadosVenta
    );


    // -----------------------------------------
    // PEDIDOS DE HOY
    // -----------------------------------------

    const [pedidosHoy] = await pool.query(
      `
      SELECT COUNT(*) AS cantidad
      FROM pedidos
      WHERE DATE(fecha_pedido) = CURDATE()
      `
    );


    // -----------------------------------------
    // PEDIDOS TOTALES
    // -----------------------------------------

    const [pedidosTotales] = await pool.query(
      `
      SELECT COUNT(*) AS cantidad
      FROM pedidos
      `
    );


    // -----------------------------------------
    // PENDIENTES
    // -----------------------------------------

    const [pendientes] = await pool.query(
      `
      SELECT COUNT(*) AS cantidad
      FROM pedidos
      WHERE estado = 'Pendiente'
      `
    );


    // -----------------------------------------
    // COMPROBANTES ENVIADOS
    // -----------------------------------------

    const [comprobantes] = await pool.query(
      `
      SELECT COUNT(*) AS cantidad
      FROM pedidos
      WHERE estado = 'Comprobante Enviado'
      `
    );


    // -----------------------------------------
    // ENTREGADOS
    // -----------------------------------------

    const [entregados] = await pool.query(
      `
      SELECT COUNT(*) AS cantidad
      FROM pedidos
      WHERE estado = 'Entregado'
      `
    );


    // -----------------------------------------
    // CANCELADOS
    // -----------------------------------------

    const [cancelados] = await pool.query(
      `
      SELECT COUNT(*) AS cantidad
      FROM pedidos
      WHERE estado = 'Cancelado'
      `
    );


    // -----------------------------------------
    // PROMEDIO DE VENTA
    // -----------------------------------------

    const [promedioVenta] = await pool.query(
      `
      SELECT
        COALESCE(AVG(total), 0) AS promedio
      FROM pedidos
      WHERE estado IN (${placeholders})
      `,
      estadosVenta
    );


    // -----------------------------------------
    // VENTAS ÚLTIMOS 7 DÍAS
    // -----------------------------------------

    const [ventasDiarias] = await pool.query(
      `
      SELECT
        DATE(fecha_pedido) AS fecha,
        COALESCE(SUM(total), 0) AS total,
        COUNT(*) AS pedidos

      FROM pedidos

      WHERE fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)

      AND estado IN (${placeholders})

      GROUP BY DATE(fecha_pedido)

      ORDER BY fecha ASC
      `,
      estadosVenta
    );


    // -----------------------------------------
    // ÚLTIMOS PEDIDOS
    // -----------------------------------------

    const [ultimosPedidos] = await pool.query(
      `
      SELECT
        p.id_pedido,
        p.total,
        p.estado,
        p.fecha_pedido,
        c.nombre AS cliente_nombre

      FROM pedidos p

      INNER JOIN clientes c
        ON p.id_cliente = c.id_cliente

      ORDER BY p.fecha_pedido DESC

      LIMIT 10
      `
    );


    // -----------------------------------------
    // RESPUESTA
    // -----------------------------------------

    res.json({

      ventasHoy: Number(ventasHoy[0].total),

      ventasMes: Number(ventasMes[0].total),

      pedidosHoy: Number(pedidosHoy[0].cantidad),

      pedidosTotales: Number(
        pedidosTotales[0].cantidad
      ),

      pendientes: Number(
        pendientes[0].cantidad
      ),

      comprobantes: Number(
        comprobantes[0].cantidad
      ),

      entregados: Number(
        entregados[0].cantidad
      ),

      cancelados: Number(
        cancelados[0].cantidad
      ),

      promedioVenta: Number(
        promedioVenta[0].promedio
      ),

      ventasDiarias,

      ultimosPedidos

    });


  } catch (error) {

    console.error(
      "ERROR CONTABILIDAD:",
      error
    );

    res.status(500).json({
      error: "Error al obtener contabilidad"
    });

  }

};

module.exports = {
  crearPedido,
  obtenerPedidos,
  obtenerDetallePedido,
  cambiarEstadoPedido,
  obtenerContabilidad
};