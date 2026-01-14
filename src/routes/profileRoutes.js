import express from 'express';
import { profileController } from '../controllers/profileController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas protegidas para o próprio perfil
router.get('/me', authenticateToken, profileController.getMyProfile);
router.put('/me', authenticateToken, profileController.updateMyProfile);

// Rotas existentes
router.put('/:id', profileController.updateProfile);
router.get('/providers', profileController.findAllProviders);

export default router;