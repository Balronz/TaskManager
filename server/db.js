/**
 * Importar bibliotecas
 */
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

//Variables de la BBDD
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;
const URI = `mongodb://${user}:${password}@${host}:${port}/${dbname}`;

//Conectar mongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error, "Error connecting to MongoDB");
        process.exit(1); //Se cierra la app si falla la conexion
    }
}
    
//Exportar el archivo para usarse en toda la app
export default connectDB;