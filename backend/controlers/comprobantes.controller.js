const pool = require('../config/bd');

const subirComprobante = async (req, res) => {

    const { id_pedido } = req.params;

    try {

        if (!req.file) {
            return res.status(400).json({
                message: 'Debe subir un comprobante'
            });
        }

        const [pedido] = await pool.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [id_pedido]
        );

        if (pedido.length === 0) {
            return res.status(404).json({
                message: 'Pedido no encontrado'
            });
        }

        await pool.query(
            'INSERT INTO comprobantes (id_pedido, archivo) VALUES (?, ?)',
            [id_pedido, req.file.filename]
        );

        await pool.query(
            `UPDATE pedidos
             SET estado = 'Comprobante Enviado'
             WHERE id_pedido = ?`,
            [id_pedido]
        );

        res.status(200).json({
            message: 'Comprobante subido correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error al subir el comprobante'
        });
    }
};

module.exports = {
    subirComprobante
};