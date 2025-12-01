// Onde fica as rotas do Front-end e a URLs

import express from 'express';
import { appointmentController } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', appointmentController.create);

export default router;