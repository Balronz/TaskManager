//Endpoint REST APIS

import express from 'express';
import Task from '../models/task.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { showAllTasks, createTask, displayTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

//GET /api/tasks
router.get('/tasks', authMiddleware, showAllTasks); 

//POST /api/tasks
router.post('/tasks', authMiddleware, createTask);

//GET /api/tasks/:id
router.get('/tasks/:id', authMiddleware, displayTask);

//PUT /api/tasks/:id
router.put('/tasks/:id', authMiddleware, updateTask);

//DELETE /api/tasks/:id
router.delete('/tasks/:id', authMiddleware, deleteTask);

export default router;