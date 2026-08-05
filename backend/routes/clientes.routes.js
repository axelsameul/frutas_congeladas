const Routes= require('express').Router()

const {
    crearPedido
}=require('../controlers/pedidos.controller')

Routes.post('/',crearPedido)

module.exports=Routes