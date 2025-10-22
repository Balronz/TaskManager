//Importar bibliotecas
import mongoose from "mongoose";
import date from "date-and-time";
import validator from "validator"; //Validador email
import bcrypt from "bcryptjs"; //Encriptar contraseñas


//Crear la clase User

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => { //Validador de email, hace uso de la libreria y del metodo validator.IsEmail(emailValor)
            return validator.isEmail(value);
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Hook para encriptar password
userSchema.pre('save', async function(next) {
    try {
        //comprobar si se ha modificado la contraseña
        if(!this.isModified('password')) return next();

        //Generar salr round y el hash de password
        const saltRounds = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltRounds);

        next(); //Se pasa al siguiente middleware, guardar(save)
    }
    catch (error){
        console.error(error);
    }
});

//Validador/comparador de contraseñas(password)

userSchema.methods.isValidPassword = async function(password) {
    try{
        //Comprobar la password escrita con la hasheada y guardada
        return await bcrypt.compare(password, this.password);
    }
    catch(error){
        throw new Error('Error al comprobar la password');
    }
}

//Generar el modelo User
const User = mongoose.model('User', userSchema);

//Exportar User para poder usarlo en toda la app
export default User;