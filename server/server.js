import connectDB from "./config/db.js"; //Importar la conexion a la BBDD
import express from "express"; //Importar express

connectDB();//Conectar a la BBDD
const PORT = process.env.PORT || 4000

const app = express(); //Crear una instancia de express

//Ruta principal prueba
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
