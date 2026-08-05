const Router= require('express').Router();
const {crearOpinion,obtenerOpiniones,eliminarOpinion}= require('../controlers/opinionesClientes');

Router.post('/',crearOpinion);
Router.get('/',obtenerOpiniones)
Router.delete("/:id", eliminarOpinion);
module.exports=Router;