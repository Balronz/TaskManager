//Importar bibliotecas
import express from "express";
import mongoose from "mongoose";
import * as date from "date-and-time";
import User from "./user.js";

//Crear la clase Task
const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    status:{
        type: String,
        enum:['pending', 'in progress', 'done'],
        default: 'pending'
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId, //Indica lo que va a almacenar, en este caso el ID de un usuario
        ref: 'User', //Indica la coleccion a la que pertenece
        required: true
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId, //Indica lo que va a almacenar, en este caso el ID de un usuario
        ref: 'User', //Indica la coleccion a la que pertenece
        required: false
    },
    
}, 
{timestamps: true}); 


//Validar el titulo, status y assignedTO
taskSchema.pre('save', async function(next) {
    try {

        //Primero validar que el titulo este escrito
        if(!this.title || this.title.trim() === ''){
            throw new Error('El titulo es obligatorio');
        }
    
        //Validar que el status es de las opciones permitidas
        if(this.status !== 'pending' && this.status !== 'in progress' && this.status !== 'done'){
            throw new Error('El status es incorrecto');
        }
        //Comprobar que el usuario existe para assigned to
        if(this.assignedTo) {
            const assignedUser = await User.findById(this.assignedTo);
            if(!assignedUser) {
                throw new Error('El usuario asignado no existe');
            }
        }
        next();
    } catch(err) {
        next(err);
    }
});

//Crear el modelo Task
const Task = mongoose.model('Task', taskSchema);

//Exportar Task para poder usarlo en toda la app
export default Task;