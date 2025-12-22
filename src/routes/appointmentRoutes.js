// Onde fica as rotas do Front-end e a URLs

import express from 'express';
import { appointmentController } from '../controllers/appointmentController.js';

const router = express.Router();
router.post('/', appointmentController.create);
// 21/12/2025 - Adicione a nova rota
router.get('/client/:client_id', appointmentController.listMyAppointments);
export default router;