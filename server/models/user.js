/** 
 * 
 * El modelo de usuario define la estructura que tendra cada usuario de la BBDD
**/

import mongoose from "mongoose";
import date from "date-and-time";


const user = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    creationDate: {
        type: date,
        default: Date.now
    }
});


//Crear el modelo de usuario
const User = mongoose.model('User', userSchema);

//Exportar el modelo de usuario
export default User;
