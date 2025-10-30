//Endpoint REST APIS

import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { showAllTasks, createTask, displayTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

//GET /api/tasks
router.get('/', authMiddleware, showAllTasks); 

//POST /api/tasks
router.post('/', authMiddleware, createTask);

//GET /api/tasks/:id
router.get('/:id', authMiddleware, displayTask);

//PUT /api/tasks/:id
router.put('/:id', authMiddleware, updateTask);

//DELETE /api/tasks/:id
router.delete('/:id', authMiddleware, deleteTask);

export default router;