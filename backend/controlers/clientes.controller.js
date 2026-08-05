const pool = require('../config/bd')

const crearCliente = async (req,res) => {
    const {
    nombre,
    telefono,
    email,
    direccion
  } = req.body;
  try{
    const [result]= await pool.query('insert into clientes(nombre,telefono,email,direccion)values(?,?,?,?)'),
    [nombre,telefono,email,direccion]
    res.json({message:'cliente creado exitosamente',id:result.insertId})
  }catch(error){
    res.status(500).json({error:'error al crear el cliente '})
  }
}

module.exports={
    crearCliente
}