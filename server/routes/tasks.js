//Endpoint REST APIS

import express from 'express';
import Task from './models/task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

//GET /api/tasks
//Ruta para devolver lista de tareas del usuario
router.get('/tasks', authMiddleware, async (req, res) => {
    try{

        let tasks;
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
        tasks = await Task.find(filter)
            .populate('createdBy assignedTo', 'name email role')
            .sort({ createdAt: -1 }); //Ordenar por fecha de creacion

            res.status(200).json(tasks);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

//POST /api/tasks
//Ruta para devolver la rarea creada(201)
router.post('/tasks', authMiddleware, async (req, res) => {

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
});

//GET /api/tasks/:id
//Ruta para obtener la tarea encontrada
router.get('/tasks/:id', authMiddleware, async (req, res) => {

    try{
        const task = Task.findById(req.params.id); //Buscamos la tarea por el ID

        if(!task){
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        //Verificar permisos de admin o creador
        if(
            req.user.role !== "admin" &&
            req.user.createdBy.toString() !== task.createdBy.toString() &&
            req.user.assignedTo.toString() !== task.assignedTo.toString()
        ) {
            return res.status(401).json({error: 'No autorizado'});
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//PUT /api/tasks/:id
//Ruta para actualizar la tarea

router.put('/tasks/:id', authMiddleware, async(req, res) => {

    //Lo que recibimos por la peticion post 
    const { title, description, status, assignedTo } = req.body;

    try{
        const task = Task.findById(req.params.id); //Buscamos la tarea por id

        if(!task){
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        //Verificar permisos
        if(
            req.user.role !== "admin" &&
            req.user.createdBy.toString() !== task.createdBy.toString() &&
            req.user.assignedTo.toString() !== task.assignedTo.toString()
        ) {
            return res.status(401).json({error: 'No autorizado'});
        }

        //Actualizar la tarea
        task.title = title;
        task.description = description;
        task.status = status;
        task.assignedTo = assignedTo;

        await task.save();

        res.status(200).json(task);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
});

//DELETE /api/tasks/:id
//Ruta para eliminar una tarea

router.delete('/tasks/:id', authMiddleware, async(req, res) =>{

    try{
        const task = Task.findById(req.params.id); //Obtener la tarea por id

    //Verificar permisos
        if(!task){
            return res.status(404).json({error: 'Tarea no encontrada'});
        }

        if(
            req.user.role !== "admin" &&
            req.user.createdBy.toString() !== task.createdBy.toString() &&
            req.user.assignedTo.toString() !== task.assignedTo.toString()
        ) {
            return res.status(401).json({error: 'No autorizado'});
        }

        return res.status(200).json(task);
        await task.remove(); //Elimina la tarea
    } catch(err) {
        return res.status(500).json({error: err.message});
    }


});