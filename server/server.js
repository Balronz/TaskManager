import connectDB from "./config/db.js"; //Importar la conexion a la BBDD
import express from "express"; //Importar express
import auth from "./routes/auth.js";
import dotenv from "dotenv";


dotenv.config();

connectDB();//Conectar a la BBDD
const PORT = process.env.PORT || 4000

const app = express(); //Crear una instancia de express
app.use(express.json());


//Rutas
app.use('/api/auth', auth);

//Llamada al puerto
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


