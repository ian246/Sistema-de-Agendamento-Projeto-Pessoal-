

import express from 'express';
import { appointmentController } from '../controllers/appointmentController.js';

const router = express.Router();
router.post('/', appointmentController.create);

router.get('/client/:client_id', appointmentController.listMyAppointments);
export default router;