//ENDPOINTS REST APIS

import express from 'express';//Importar la librerira express
import { registerUser, loginUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

//API /api/auth/register

router.post('/register', registerUser);

//API /api/auth/login
router.post('/login', loginUser);

