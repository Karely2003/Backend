import express from 'express';
import usersRoutes from './routes/usersRoutes.js'
import clientesRoutes from './routes/clientesRoutes.js'
import citasRoutes from './routes/citasRoutes.js'
import pagosRoutes from './routes/pagosRoutes.js';
import reportesRoutes from './routes/reportesRoutes.js';




import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;
import sequelize from './database/Conection/database.js';


//configuracion cors
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHearders: ["Content-Type"],
    credentials: true,

};

//middlewares
app.use(cors(corsOptions));
app.options("", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));//analiza datos de formulario


//Rutas
app.use("/users", usersRoutes);
app.use("/clientes", clientesRoutes);
app.use('/citas', citasRoutes);
app.use('/pagos', pagosRoutes);
app.use('/reportes', reportesRoutes);


app.listen(PORT, () => {
    console.log(`El servidor corriendo en el puerto ${PORT}`);


});

