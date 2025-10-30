
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

//Registro de usuarios

export const registerUser = async (req, res) => {
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

        //Generar token
        const token = generateToken({id: user._id, role: user.role});

        //Devolver estos datos excepto la contraseña
        res.json ({
            message: 'Usuario creado correctamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });

    } catch(err) {

        return res.status(500).json({error: err.message});
    }
        
};

//Login de usuarios
export const loginUser = async (req, res) => {
    try {
        //Recibimos esto en la peticion post
        const {email, password} = req.body;

        //Validar campos que no esten vacios
        if(!email || !password) {
            return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }

        //Verificar que usuario existe y contraseña es correcta
        const userExists = await User.findOne({email});
        if(!userExists) {
            return res.status(400).json({error: 'usuario no encontrado'});
        }

        //Comprobar si la contraseña es valida
        const validPassword = await userExists.isValidPassword(password);
        if(!validPassword) {
            return res.status(400).json({error: 'La contraseña es incorrecta'});
        }

        //Accion: Generar token (la funcion la importamos desde utils/generateToken.js)
        const token = generateToken({ id: userExists._id, role: userExists.role });

        res.status(200).json({
            message: 'Login correcto',
            user: {
                id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                role: userExists.role
            },
            token
        });

    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

