//ENDPOINTS REST APIS

import express from 'express';//Importar la librerira express
import User from '../models/user.js';

const router = express.Router();

router.use(express.json()); //Para poder analizar solicitudes en formato JSON

//POST /api/auth/register
router.post('/register', async (req, res) => {
    try{
        //Recibimos esto en la peticion post
        const {name, email, password} = req.body;

        //Validacion de email y contraseña
        if(!email || password.length < 8) {
            return res.status(400).json({error: 'Email o contraseña incorrectos'});
        }
        
        //Crear un nuevo usuario (para ejecutar el hash de contraseña)
        const user = new User({name, email, password});

        //Guardar el usuario en la BBDD
        await user.save(); 
        
        //Devolver estos datos excepto la contraseña
        res.json ({
            message: 'Usuario creado correctamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch(err) {

        return res.status(500).json({error: err.message});
    }
        
});

//POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        //Recibimos esto en la peticion post
        const {email, password} = req.body;

        //Validar campos que no esten vacios
        if(!email || !password) {
            return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }

        //Verificar que usuario existe y contraseña es correcta
        const userExists = await User.findOne({email});
        if(userExists) {
            
            return res.status(400).json({error: 'El usuario ya existe'});

        }

        //Comprobar si la contraseña es valida
        const validPassword = await user.isValidPassword(password);
        if(!validPassword) {
            return res.status(400).json({error: 'La contraseña es incorrecta'});
        }

        //Accion: Generar token (la funcion la importamos desde /middleware/authMiddleware.js)

        res.status(200).json({
            message: 'Login correcto',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

export default router;