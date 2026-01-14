import express from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { authenticateToken, checkIsProvider } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota protegida para provider ver seus agendamentos
router.get('/provider/me', authenticateToken, checkIsProvider, appointmentController.getProviderAppointments);

// Rotas existentes
router.post('/', appointmentController.create);
router.get('/client/:client_id', appointmentController.listMyAppointments);

export default router;