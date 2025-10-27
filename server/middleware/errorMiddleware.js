//Funcion que manejara los errores generales de la app
//Luego de exportarlo, lo importaremos y usaremos en el punto de entrada de la app, server.js
function errorMiddleware(err, req, res, next){
    console.log(err.stack);
    res.status(500).json({ error: 'Internal server error' });
}

export default errorMiddleware;