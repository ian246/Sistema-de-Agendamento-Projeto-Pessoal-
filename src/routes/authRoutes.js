import express from 'express';
import { authController } from '../controllers/authController.js'; // Seu controller

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register); // Se tiver registro

export default router;