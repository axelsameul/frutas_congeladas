const express = require("express");

const router = express.Router();

const {
  crearPedido,
  obtenerPedidos,
  obtenerDetallePedido,
  cambiarEstadoPedido,
  obtenerContabilidad
} = require("../controlers/pedidos.controller");


// ========================================
// CREAR PEDIDO
// POST /api/pedidos
// ========================================

router.post(
  "/",
  crearPedido
);


// ========================================
// CONTABILIDAD
// GET /api/pedidos/contabilidad
// ========================================

router.get(
  "/contabilidad",
  obtenerContabilidad
);


// ========================================
// OBTENER TODOS LOS PEDIDOS
// GET /api/pedidos
// ========================================

router.get(
  "/",
  obtenerPedidos
);


// ========================================
// DETALLE DEL PEDIDO
// GET /api/pedidos/:id/detalle
// ========================================

router.get(
  "/:id/detalle",
  obtenerDetallePedido
);


// ========================================
// CAMBIAR ESTADO
// PUT /api/pedidos/:id/estado
// ========================================

router.put(
  "/:id/estado",
  cambiarEstadoPedido
);


module.exports = router;