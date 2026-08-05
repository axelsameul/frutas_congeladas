const express= require('express')
const cors= require('cors')
const path = require("path");
const app= express()
app.use(express.json())
app.use(cors())


app.use( "/uploads", express.static(path.join(__dirname, "uploads")) );

const productosRoutes=require('./routes/productos.routes')
const clientesRoutes=require('./routes/clientes.routes')
const pedidosRoutes=require('./routes/pedidos.routes')  
const comprobantesRoutes=require('./routes/comprobantes.Routes')
const opinionesRoutes=require('./routes/opinionesClient.routes')
const loginRoutes = require('./routes/loginRoutes');

app.use('/api/login', loginRoutes);
app.use('/api/opiniones', opinionesRoutes);
app.use('/api/productos',productosRoutes)
app.use('/api/clientes',clientesRoutes)
app.use('/api/comprobantes',comprobantesRoutes)
app.use('/api/pedidos',pedidosRoutes)
const PORT= process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log('servidor corriendo en el puerto',PORT)
})

