import connectDB from "./config/db.js"; //Importar la conexion a la BBDD
import express from "express"; //Importar express
import auth from "./routes/auth.js";
import dotenv from "dotenv";
import errorMiddleware from "./middleware/errorMiddleware.js";


dotenv.config();

connectDB();//Conectar a la BBDD
const PORT = process.env.PORT || 4000

const app = express(); //Crear una instancia de express
app.use(express.json());


//Rutas
app.use('/api/auth', auth, errorMiddleware);

//Llamada al puerto
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


