

const db = require("../config/bd");

const obtenerOpiniones = async(req,res)=>{

    try{

        const [result] = await db.query(
            "SELECT * FROM opiniones ORDER BY fecha DESC"
        );

        res.json(result);


    }catch(error){

        console.log(error);

        res.status(500).json({
            error:"Error al obtener opiniones"
        });

    }

};

const eliminarOpinion = async(req,res)=>{

    try{

        const {id} = req.params;


        await db.query(
            "DELETE FROM opiniones WHERE id_opinion = ?",
            [id]
        );


        res.json({
            message:"Opinión eliminada correctamente"
        });


    }catch(error){

        console.log(error);

        res.status(500).json({
            error:"Error al eliminar opinión"
        });

    }

};

const crearOpinion = async (req, res) => {

    try {

        const { nombre, comentario, estrellas } = req.body;


        const [result] = await db.query(
            "INSERT INTO opiniones(nombre, comentario, estrellas) VALUES(?,?,?)",
            [
                nombre,
                comentario,
                estrellas
            ]
        );


        res.json({
            message: "Opinión creada exitosamente",
            id: result.insertId
        });


    } catch(error) {

        console.log(error);

        res.status(500).json({
            error: "Error al crear opinión"
        });

    }

};


module.exports = {
    crearOpinion,obtenerOpiniones, eliminarOpinion
};

