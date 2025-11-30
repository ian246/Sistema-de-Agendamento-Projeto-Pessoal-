import express from 'express';
import { serviceController } from '../controllers/serviceController.js';

//1. Instancia do express para eu fazer a busca com o servidor
const router = express.Router();

//2. Propriedades do Express para fazer o get e o post
router.get('/', serviceController.listServices);
router.post('/', serviceController.create);

export default router;

//Flux
// Routes => Controller => Service => repository => Config
