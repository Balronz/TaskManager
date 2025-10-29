import User from "../models/user.js";
import Task from "../models/task.js";
import generateToken from "../utils/generateToken.js";

//Mostrar listas de tareas

const showAllTasks = async (req, res) => {
    try{

        const { status } = req.query; //Obtener el filtro desde la query
        const filter = {}; //objeto dinamico de filtros

        //Si el usuario no es admin, solo ve sus propias tareas
        if(req.user.role !== 'admin') {

            filter.createdBy = req.user.id;
        } 

        if(status) {

            const allowedStatus = ['pending', 'in progress', 'done'];

            if(!allowedStatus.includes(status)) {

                return res.status(400).json({error: 'El status es incorrecto'});
            }
            filter.status = status;
        }

        //Buscar tareas con los filtros  aplicados
        const tasks = await Task.find(filter)
            .populate('createdBy assignedTo', 'name email role')
            .sort({ createdAt: -1 }); //Ordenar por fecha de creacion

        res.status(200).json(tasks);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

//Devolver la tarea creada(201)

const createTask = async (req, res) => {
    try{
        //Lo que recibimos de la peticion post
        const { title, description, assignedTo } = req.body;

        //Validar campos que no esten vacios
        if(!title || !description) {
            return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }

        //Crear tarea
        const task = new Task({ title, description, assignedTo, createdBy : req.user.id });
        await task.save();

        //Devuelve la tarea creada y el usuario que la creo
        res.status(201).json(task);

    }
    catch(err){

        res.status(500).json({error: err.message});
    }
};

//Devolver la tarea encontrada

const displayTask = async (req, res) => {
    
    try{
        const task = await Task.findById(req.params.id); //Buscamos la tarea por el ID

        if(!task){
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        //Verificar permisos de admin o creador
        if(
            req.user.role !== "admin" &&
            req.user.id.toString() !== task.createdBy.toString() &&
            req.user.id.toString() !== task.assignedTo?.toString()
        ) {
            return res.status(401).json({error: 'No autorizado'});
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


//Actualizar la tarea

const updateTask = async (req, res) => {
    //Lo que recibimos por la peticion post 

    try{
            const { title, description, status, assignedTo } = req.body;

        const task =  await Task.findById(req.params.id); //Buscamos la tarea por id

        if(!task){
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        //Verificar permisos
        if(
            req.user.role !== "admin" &&
            req.user.id.toString() !== task.createdBy.toString() &&
            req.user.id.toString() !== task.assignedTo?.toString()
        ) {
            return res.status(401).json({error: 'No autorizado'});
        }

        //Actualizar la tarea
        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.status = status ?? task.status;
        task.assignedTo = assignedTo ?? task.assignedTo;

        await task.save();

        res.status(200).json(task);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

//Eliminar tarea

const deleteTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id); //Obtener la tarea por id

    //Verificar permisos
        if(!task){
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        if(
            req.user.role !== "admin" &&
            req.user.id.toString() !== task.createdBy.toString() &&
            req.user.id-toString() !== task.assignedTo?.toString()
        ) {
            return res.status(401).json({error: 'No autorizado'});
        }
        await task.remove(); //Elimina la tarea
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};