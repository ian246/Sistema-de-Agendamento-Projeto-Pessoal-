import express from 'express';
import { profileController } from '../controllers/profileController.js'

const router = express.Router();

router.put('/:id', profileController.updateProfile);
router.get('/providers', profileController.findAllProviders);

export default router;