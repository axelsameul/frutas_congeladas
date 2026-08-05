const router = require('express').Router();
const upload = require('../middleware/upload');
const { subirComprobante } = require('../controlers/comprobantes.controller');

router.post(
    '/:id_pedido',
    upload.single('comprobante'),
    subirComprobante
);

module.exports = router;